const assert = require('assert')
const parseSpec = require('../parseSpec')
const stringify = require('./support/stringify')

describe('parseSpec', () => {

  const assertParses = (spec, expectedParseResult) => {
    const actualParseResult = parseSpec(spec)
    stringify.functionsIn(expectedParseResult)
    stringify.functionsIn(actualParseResult)
    assert.deepEqual(actualParseResult, expectedParseResult)
  }

  it('parses an anonymous description', () => {
    const spec = describe => {
      describe(() => 123, it => it.shouldEqual(123))
    }

    assertParses(spec, {
      descriptions: [
        {
          factory: () => 123,
          assertions: [it => it.shouldEqual(123)]
        }
      ]
    })
  })

  it('parses a named description', () => {
    const spec = describe => {
      describe('one two three', () => 123, it => it.shouldEqual(123))
    }

    assertParses(spec, {
      descriptions: [
        {
          name: 'one two three',
          factory: () => 123,
          assertions: [it => it.shouldEqual(123)]
        }
      ]
    })
  })

  it('parses a nested anonymous description', () => {
    const spec = describe => {
      describe('veg',
        describe(
          () => 'carrot',
          it => it.shouldEqual('carrot')
        )
      )
    }

    assertParses(spec, {
      descriptions: [
        {
          name: 'veg',
          assertions: [
            {
              factory: () => 'carrot',
              assertions: [
                it => it.shouldEqual('carrot')
              ]
            }
          ]
        }
      ]
    })
  })

  it('parses a nested named description', () => {
    const spec = describe => {
      describe('fruit',
        describe('citrus',
          () => 'orange',
          it => it.shouldEqual('orange')
        )
      )
    }

    assertParses(spec, {
      descriptions: [
        {
          name: 'fruit',
          assertions: [
            {
              name: 'citrus',
              factory: () => 'orange',
              assertions: [
                it => it.shouldEqual('orange')
              ]
            }
          ]
        }
      ]
    })
  })

  it('parses many descriptions', () => {
    const spec = describe => {
      describe(() => 55, it => it.shouldEqual(55))
      describe('sixty six', () => 66, it => it.shouldEqual(66))
    }

    assertParses(spec, {
      descriptions: [
        {
          factory: () => 55,
          assertions: [it => it.shouldEqual(55)]
        },
        {
          name: 'sixty six',
          factory: () => 66,
          assertions: [it => it.shouldEqual(66)]
        }
      ]
    })
  })

  it('parses descriptions mixed with assertions', () => {
    const spec = describe => {
      describe(
        () => 101,
        it => it.shouldEqual(101),
        describe(
          () => 202,
          it => it.shouldEqual(202)
        ),
        it => it.shouldEqual(100 + 1)
      )
    }

    assertParses(spec, {
      descriptions: [
        {
          factory: () => 101,
          assertions: [
            it => it.shouldEqual(101),
            {
              factory: () => 202,
              assertions: [
                it => it.shouldEqual(202)
              ]
            },
            it => it.shouldEqual(100 + 1)
          ]
        }
      ]
    })
  })
})
