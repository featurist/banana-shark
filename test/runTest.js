const assert = require('assert')
const runSuite = require('../run')
const stringify = require('./support/stringify')

describe('Run', () => {
  const run = suite => {
    const listener = new Listener()
    runSuite(suite, listener)
    return listener.events
  }

  const assertEvents = (actualEvents, expectedEvents) => {
    stringify.functionsIn(actualEvents)
    stringify.functionsIn(expectedEvents)
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
        spec: suite.specs[0],
        suite: suite
      },
      {
        type: 'descriptionStarted',
        description: suite.specs[0].descriptions[0],
        spec: suite.specs[0],
        suite: suite
      },
      {
        type: 'assertionStarted',
        assertion: suite.specs[0].descriptions[0].assertions[0],
        description: suite.specs[0].descriptions[0],
        spec: suite.specs[0],
        suite: suite
      },
      {
        type: 'assertionPassed',
        assertion: suite.specs[0].descriptions[0].assertions[0],
        description: suite.specs[0].descriptions[0],
        spec: suite.specs[0],
        suite: suite
      },
      {
        type: 'descriptionEnded',
        description: suite.specs[0].descriptions[0],
        spec: suite.specs[0],
        suite: suite
      },
      {
        type: 'specEnded',
        spec: suite.specs[0],
        suite: suite
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
        spec: suite.specs[0],
        suite: suite
      },
      {
        type: 'descriptionStarted',
        description: suite.specs[0].descriptions[0],
        spec: suite.specs[0],
        suite: suite
      },
      {
        type: 'assertionStarted',
        assertion: suite.specs[0].descriptions[0].assertions[0],
        description: suite.specs[0].descriptions[0],
        spec: suite.specs[0],
        suite: suite
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
        assertion: suite.specs[0].descriptions[0].assertions[0],
        description: suite.specs[0].descriptions[0],
        spec: suite.specs[0],
        suite: suite
      },
      {
        type: 'descriptionEnded',
        description: suite.specs[0].descriptions[0],
        spec: suite.specs[0],
        suite: suite
      },
      {
        type: 'specEnded',
        spec: suite.specs[0],
        suite: suite
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
        spec: suite.specs[0],
        suite: suite
      },
      {
        type: 'descriptionStarted',
        description: outerDescription,
        spec: suite.specs[0],
        suite: suite
      },
      {
        type: 'descriptionStarted',
        description: innerDescription,
        spec: suite.specs[0],
        suite: suite
      },
      {
        type: 'assertionStarted',
        assertion: innerDescription.assertions[0],
        description: innerDescription,
        spec: suite.specs[0],
        suite: suite
      },
      {
        type: 'assertionPassed',
        assertion: innerDescription.assertions[0],
        description: innerDescription,
        spec: suite.specs[0],
        suite: suite
      },
      {
        type: 'descriptionEnded',
        description: innerDescription,
        spec: suite.specs[0],
        suite: suite
      },
      {
        type: 'descriptionEnded',
        description: outerDescription,
        spec: suite.specs[0],
        suite: suite
      },
      {
        type: 'specEnded',
        spec: suite.specs[0],
        suite: suite
      },
      {
        type: 'suiteEnded',
        suite: suite
      }
    ])
  })
})

class Listener {
  constructor() {
    this.events = []
  }

  suiteStarted(suite) {
    this.events.push({ type: 'suiteStarted', suite })
  }

  suiteEnded(suite) {
    this.events.push({ type: 'suiteEnded', suite })
  }

  specStarted(spec, suite) {
    this.events.push({ type: 'specStarted', spec, suite })
  }

  specEnded(spec, suite) {
    this.events.push({ type: 'specEnded', spec, suite })
  }

  descriptionStarted(description, spec, suite) {
    this.events.push({ type: 'descriptionStarted', description, spec, suite })
  }

  descriptionEnded(description, spec, suite) {
    this.events.push({ type: 'descriptionEnded', description, spec, suite })
  }

  assertionStarted(assertion, description, spec, suite) {
    this.events.push({ type: 'assertionStarted', assertion, description, spec, suite })
  }

  assertionPassed(assertion, description, spec, suite) {
    this.events.push({ type: 'assertionPassed', assertion, description, spec, suite })
  }

  assertionFailed(error, assertion, description, spec, suite) {
    this.events.push({ type: 'assertionFailed', error, assertion, description, spec, suite })
  }
}
