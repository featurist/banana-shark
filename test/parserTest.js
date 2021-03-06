/* eslint-env mocha */

const assert = require('assert')
const Parser = require('..').Parser
const stringify = require('./support/stringify')

describe('Parser', () => {

  const assertParses = (spec, expectedParseResult) => {
    const actualParseResult = new Parser().parse(spec)
    stringify.functionsIn(expectedParseResult)
    stringify.functionsIn(actualParseResult)
    assert.deepStrictEqual(actualParseResult, expectedParseResult)
  }

  it('parses an anonymous description', () => {
    const spec = describe => {
      describe(() => 123, it => it.equals(123))
    }

    assertParses(spec, {
      descriptions: [
        {
          factory: () => 123,
          assertions: [it => it.equals(123)]
        }
      ]
    })
  })

  it('parses a named description', () => {
    const spec = describe => {
      describe('one two three', () => 123, it => it.equals(123))
    }

    assertParses(spec, {
      descriptions: [
        {
          name: 'one two three',
          factory: () => 123,
          assertions: [it => it.equals(123)]
        }
      ]
    })
  })

  it('parses after blocks', () => {
    const spec = describe => {
      describe(
        () => [],
        describe.after(
          array => array.push(666),
          it => it.deeplyEquals([666])
        )
      )
    }

    assertParses(spec, {
      descriptions: [
        {
          factory: () => [],
          assertions: [
            {
              factory: array => array.push(666),
              after: true,
              assertions: [
                it => it.deeplyEquals([666])
              ]
            }
          ]
        }
      ]
    })
  })

  it('parses an aspect', () => {
    const spec = describe => {
      describe.aspect(
        'one two three',
        it => it.equals(123)
      )
    }

    assertParses(spec, {
      descriptions: [
        {
          name: 'one two three',
          aspect: true,
          assertions: [it => it.equals(123)]
        }
      ]
    })
  })

  it('parses an aspect assertion', () => {
    const spec = describe => {
      describe(
        'one two three',
        () => 123,
        it => it.equals(123),
        'a number'
      )
    }

    assertParses(spec, {
      descriptions: [
        {
          name: 'one two three',
          factory: () => 123,
          assertions: [it => it.equals(123), 'a number']
        }
      ]
    })
  })

  it('parses an aspect with aspect assertions', () => {
    const spec = describe => {
      describe.aspect(
        'the meaning of life',
        'fourty three minus one'
      )
    }

    assertParses(spec, {
      descriptions: [
        {
          name: 'the meaning of life',
          aspect: true,
          assertions: ['fourty three minus one']
        }
      ]
    })
  })

  it('parses a nested anonymous description', () => {
    const spec = describe => {
      describe('veg',
        describe(
          () => 'carrot',
          it => it.equals('carrot')
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
                it => it.equals('carrot')
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
          it => it.equals('orange')
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
                it => it.equals('orange')
              ]
            }
          ]
        }
      ]
    })
  })

  it('parses many descriptions', () => {
    const spec = describe => {
      describe(() => 55, it => it.equals(55))
      describe('sixty six', () => 66, it => it.equals(66))
    }

    assertParses(spec, {
      descriptions: [
        {
          factory: () => 55,
          assertions: [it => it.equals(55)]
        },
        {
          name: 'sixty six',
          factory: () => 66,
          assertions: [it => it.equals(66)]
        }
      ]
    })
  })

  it('parses descriptions mixed with assertions', () => {
    const spec = describe => {
      describe(
        () => 101,
        it => it.equals(101),
        describe(
          () => 202,
          it => it.equals(202)
        ),
        it => it.equals(100 + 1)
      )
    }

    assertParses(spec, {
      descriptions: [
        {
          factory: () => 101,
          assertions: [
            it => it.equals(101),
            {
              factory: () => 202,
              assertions: [
                it => it.equals(202)
              ]
            },
            it => it.equals(100 + 1)
          ]
        }
      ]
    })
  })
})
