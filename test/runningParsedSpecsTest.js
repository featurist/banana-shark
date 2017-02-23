const assert = require('assert')
const Listener = require('./support/listener')
const stringify = require('./support/stringify')
const { parseSpec, runSuite } = require('..')

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

  it('runs multiple specs with various nesting', () => {
    const spec1 = parseSpec(describe => {
      describe(
        () => 123,
        it => it.shouldEqual(123),
        describe(
          () => 124,
          it => it.shouldEqual(124)
        )
      )
    })
    const spec2 = parseSpec(describe => {
      describe(
        () => 666,
        it => it.shouldEqual(999)
      )
    })
    const suite = { specs: [spec1, spec2] }
    const events = run(suite)
    const description1 = spec1.descriptions[0]
    const description2 = spec1.descriptions[0].assertions[1]
    const assertion1 = description1.assertions[0]
    const assertion2 = description2.assertions[0]
    const description3 = spec2.descriptions[0]
    const assertion3 = spec2.descriptions[0].assertions[0]

    const error1 = {
      actual: 666,
      expected: 999,
      generatedMessage: true,
      message: '666 == 999',
      name: 'AssertionError',
      operator: '=='
    }

    assertEvents(events, [
      { type: 'suiteStarted', suite },
      { type: 'specStarted', suite, spec: spec1 },
      { type: 'descriptionStarted', suite, spec: spec1, description: description1 },
      { type: 'assertionStarted', suite, spec: spec1, description: description1, assertion: assertion1 },
      { type: 'assertionPassed', suite, spec: spec1, description: description1, assertion: assertion1 },
      { type: 'descriptionStarted', suite, spec: spec1, description: description2 },
      { type: 'assertionStarted', suite, spec: spec1, description: description2, assertion: assertion2 },
      { type: 'assertionPassed', suite, spec: spec1, description: description2, assertion: assertion2 },
      { type: 'descriptionEnded', suite, spec: spec1, description: description2 },
      { type: 'descriptionEnded', suite, spec: spec1, description: description1 },
      { type: 'specEnded', suite, spec: spec1 },
      { type: 'specStarted', suite, spec: spec2 },
      { type: 'descriptionStarted', suite, spec: spec2, description: description3 },
      { type: 'assertionStarted', suite, spec: spec2, description: description3, assertion: assertion3 },
      { type: 'assertionFailed', suite, spec: spec2, description: description3, assertion: assertion3, error: error1 },
      { type: 'descriptionEnded', suite, spec: spec2, description: description3 },
      { type: 'specEnded', suite, spec: spec2 },
      { type: 'suiteEnded', suite }
    ])
  })

})
