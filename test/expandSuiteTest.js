const assert = require('assert')
const stringify = require('./support/stringify')
const expandSuite = require('../lib/expandSuite')

describe('expandSuite', () => {
  it('replaces abstract assertions with nested descriptions', () => {
    const inputSuite = {
      specs: [
        {
          descriptions: [
            {
              factory: () => 123,
              assertions: [
                it => it.equals(123),
                'equals 124 minus 1'
              ]
            }
          ]
        },
        {
          descriptions: [
            {
              name: 'equals 124 minus 1',
              assertions: [
                it => it.equals(124 - 1)
              ]
            }
          ]
        }
      ]
    }
    const outputSuite = {
      specs: [
        {
          descriptions: [
            {
              factory: () => 123,
              assertions: [
                it => it.equals(123),
                {
                  name: 'equals 124 minus 1',
                  assertions: [
                    it => it.equals(124 - 1)
                  ]
                }
              ]
            }
          ]
        },
        {
          descriptions: []
        }
      ]
    }
    assert.deepEqual(
      stringify.functionsIn(expandSuite(inputSuite)),
      stringify.functionsIn(outputSuite)
    )
  })

  it('replaces very abstract assertions with nested descriptions', () => {
    const inputSuite = {
      specs: [
        {
          descriptions: [
            {
              factory: () => 123,
              assertions: [
                'equals 124 minus 1'
              ]
            },
            {
              name: 'equals 123 plus 1',
              assertions: [
                it => it.equals(123 + 1)
              ]
            }
          ]
        },
        {
          descriptions: [
            {
              name: 'equals 124 minus 1',
              assertions: [
                'equals 123 plus 1'
              ]
            }
          ]
        }
      ]
    }
    const outputSuite = {
      specs: [
        {
          descriptions: [
            {
              factory: () => 123,
              assertions: [
                {
                  name: 'equals 124 minus 1',
                  assertions: [
                    {
                      name: 'equals 123 plus 1',
                      assertions: [
                        it => it.equals(123 + 1)
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          descriptions: []
        }
      ]
    }
    assert.deepEqual(
      stringify.functionsIn(expandSuite(inputSuite)),
      stringify.functionsIn(outputSuite)
    )
  })
})
