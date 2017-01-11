const assert = require('assert')
const Parser = require('../parser')
const Listener = require('./support/listener')
const runSuite = require('../run')
const stringify = require('./support/stringify')

describe('Running parsed specs', () => {

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

  it('runs specs at different levels of nesting', () => {
    const parser = new Parser()
    const spec = describe => {
      describe(
        () => 123,
        it => it.shouldEqual(123),
        describe(
          () => 124,
          it => it.shouldEqual(124)
        )
      )
    }
    const parsedSpec = parser.parse(spec)
    const suite = { specs: [parsedSpec] }
    const events = run(suite)
    const description1 = parsedSpec.descriptions[0]
    const description2 = parsedSpec.descriptions[0].assertions[1]
    const assertion1 = description1.assertions[0]
    const assertion2 = description2.assertions[0]

    assertEvents(events, [
      { type: 'suiteStarted', suite },
      { type: 'specStarted', suite, spec: parsedSpec },
      { type: 'descriptionStarted', suite, spec: parsedSpec, description: description1 },
      { type: 'assertionStarted', suite, spec: parsedSpec, description: description1, assertion: assertion1 },
      { type: 'assertionPassed', suite, spec: parsedSpec, description: description1, assertion: assertion1 },
      { type: 'descriptionStarted', suite, spec: parsedSpec, description: description2 },
      { type: 'assertionStarted', suite, spec: parsedSpec, description: description2, assertion: assertion2 },
      { type: 'assertionPassed', suite, spec: parsedSpec, description: description2, assertion: assertion2 },
      { type: 'descriptionEnded', suite, spec: parsedSpec, description: description2 },
      { type: 'descriptionEnded', suite, spec: parsedSpec, description: description1 },
      { type: 'specEnded', suite, spec: parsedSpec },
      { type: 'suiteEnded', suite }
    ])
  })

})
