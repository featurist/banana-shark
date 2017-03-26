const assert = require('assert')
const Suite = require('..').Suite
const stringify = require('./support/stringify')
const Listener = require('./support/listener')

describe('Suite', () => {
  const run = suite => {
    const listener = new Listener()
    new Suite(suite).run(listener)
    return listener.events
  }

  const assertEvents = (actualEvents, expectedEvents) => {
    stringify.functionsIn(actualEvents)
    stringify.functionsIn(expectedEvents)
    actualEvents.forEach(event => {
      for (var key in event) {
        if (event[key].ast) event[key] = event[key].ast
      }
    })
    assert.deepEqual(actualEvents.map(e => e.type), expectedEvents.map(e => e.type))
    assert.deepEqual(actualEvents, expectedEvents)
  }

  it('runs a single passing spec', () => {
    const suite = {
      specs: [
        {
          descriptions: [
            {
              factory: () => 123,
              assertions: [
                it => it.equals(123)
              ]
            }
          ]
        }
      ]
    }
    assertEvents(run(suite), [
      {
        type: 'suiteStarted',
        suite: suite
      },
      {
        type: 'specStarted',
        spec: suite.specs[0]
      },
      {
        type: 'descriptionStarted',
        description: suite.specs[0].descriptions[0]
      },
      {
        type: 'assertionStarted',
        assertion: suite.specs[0].descriptions[0].assertions[0]
      },
      {
        type: 'assertionPassed',
        assertion: suite.specs[0].descriptions[0].assertions[0]
      },
      {
        type: 'descriptionEnded',
        description: suite.specs[0].descriptions[0]
      },
      {
        type: 'specEnded',
        spec: suite.specs[0]
      },
      {
        type: 'suiteEnded',
        suite: suite
      }
    ])
  })

  it('runs a single failing spec', () => {
    const suite = {
      specs: [
        {
          descriptions: [
            {
              factory: () => 666,
              assertions: [
                it => it.equals(999)
              ]
            }
          ]
        }
      ]
    }
    assertEvents(run(suite), [
      {
        type: 'suiteStarted',
        suite: suite
      },
      {
        type: 'specStarted',
        spec: suite.specs[0]
      },
      {
        type: 'descriptionStarted',
        description: suite.specs[0].descriptions[0]
      },
      {
        type: 'assertionStarted',
        assertion: suite.specs[0].descriptions[0].assertions[0]
      },
      {
        type: 'assertionFailed',
        error: {
          actual: 666,
          expected: 999,
          generatedMessage: true,
          message: '666 == 999',
          name: 'AssertionError',
          operator: '=='
        },
        assertion: suite.specs[0].descriptions[0].assertions[0]
      },
      {
        type: 'descriptionEnded',
        description: suite.specs[0].descriptions[0]
      },
      {
        type: 'specEnded',
        spec: suite.specs[0]
      },
      {
        type: 'suiteEnded',
        suite: suite
      }
    ])
  })

  it('runs a single nested passing spec', () => {
    const suite = {
      specs: [
        {
          descriptions: [
            {
              name: 'outer',
              assertions: [
                {
                  name: 'inner',
                  factory: () => 333,
                  assertions: [
                    it => it.equals(333)
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
    const outerDescription = suite.specs[0].descriptions[0]
    const innerDescription = suite.specs[0].descriptions[0].assertions[0]
    assertEvents(run(suite), [
      {
        type: 'suiteStarted',
        suite: suite
      },
      {
        type: 'specStarted',
        spec: suite.specs[0]
      },
      {
        type: 'descriptionStarted',
        description: outerDescription
      },
      {
        type: 'descriptionStarted',
        description: innerDescription
      },
      {
        type: 'assertionStarted',
        assertion: innerDescription.assertions[0]
      },
      {
        type: 'assertionPassed',
        assertion: innerDescription.assertions[0]
      },
      {
        type: 'descriptionEnded',
        description: innerDescription
      },
      {
        type: 'descriptionEnded',
        description: outerDescription
      },
      {
        type: 'specEnded',
        spec: suite.specs[0]
      },
      {
        type: 'suiteEnded',
        suite: suite
      }
    ])
  })
})

describe('Suite.expand', () => {
  it('replaces aspect pointers with nested descriptions', () => {
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
              ],
              aspect: true
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
                  aspect: true,
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
      stringify.functionsIn(Suite.expand(inputSuite)),
      stringify.functionsIn(outputSuite)
    )
  })

  it('replaces aspect pointers to aspect pointers with nested descriptions', () => {
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
              ],
              aspect: true
            }
          ]
        },
        {
          descriptions: [
            {
              name: 'equals 124 minus 1',
              assertions: [
                'equals 123 plus 1'
              ],
              aspect: true
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
                  aspect: true,
                  assertions: [
                    {
                      name: 'equals 123 plus 1',
                      aspect: true,
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
      stringify.functionsIn(Suite.expand(inputSuite)),
      stringify.functionsIn(outputSuite)
    )
  })
})
