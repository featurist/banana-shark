const assert = require('assert')
const Suite = require('../suite')
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
                it => it.shouldEqual(123)
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
                it => it.shouldEqual(999)
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
                    it => it.shouldEqual(333)
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
