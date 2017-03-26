const assert = require('assert')
const Listener = require('./support/listener')
const stringify = require('./support/stringify')
const { Parser, Suite } = require('..')

describe('Running specs', () => {

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

  it('runs multiple specs with nesting and aspects', () => {
    const parser = new Parser()
    const spec1 = parser.parse(describe => {
      describe(
        () => 123,
        it => it.equals(123),
        describe(
          n => n + 1,
          it => it.equals(124)
        )
      )
    })
    const spec2 = parser.parse(describe => {
      describe(
        () => 666,
        it => it.equals(999),
        'six six seven minus one'
      )

      describe.aspect(
        'six six seven minus one',
        it => it.equals(667 - 1)
      )
    })
    const suite = { specs: [spec1, spec2] }
    Suite.expand(suite)
    const [expandedSpec1, expandedSpec2] = suite.specs
    const events = run(suite)
    const description1 = expandedSpec1.descriptions[0]
    const description2 = expandedSpec1.descriptions[0].assertions[1]
    const assertion1 = description1.assertions[0]
    const assertion2 = description2.assertions[0]
    const description3 = expandedSpec2.descriptions[0]
    const assertion3 = expandedSpec2.descriptions[0].assertions[0]
    const description4 = expandedSpec2.descriptions[0].assertions[1]
    const assertion4 = expandedSpec2.descriptions[0].assertions[1].assertions[0]

    const error1 = {
      actual: 666,
      expected: 999,
      generatedMessage: true,
      message: '666 == 999',
      name: 'AssertionError',
      operator: '=='
    }

    assertEvents(events, [
      { type: 'suiteStarted', suite: suite },
      { type: 'specStarted', spec: expandedSpec1 },
      { type: 'descriptionStarted', description: description1 },
      { type: 'assertionStarted', assertion: assertion1 },
      { type: 'assertionPassed', assertion: assertion1 },
      { type: 'descriptionStarted', description: description2 },
      { type: 'assertionStarted', assertion: assertion2 },
      { type: 'assertionPassed', assertion: assertion2 },
      { type: 'descriptionEnded', description: description2 },
      { type: 'descriptionEnded', description: description1 },
      { type: 'specEnded', spec: expandedSpec1 },
      { type: 'specStarted', spec: expandedSpec2 },
      { type: 'descriptionStarted', description: description3 },
      { type: 'assertionStarted', assertion: assertion3 },
      { type: 'assertionFailed', assertion: assertion3, error: error1 },
      { type: 'descriptionStarted', description: description4 },
      { type: 'assertionStarted', assertion: assertion4 },
      { type: 'assertionPassed', assertion: assertion4 },
      { type: 'descriptionEnded', description: description4 },
      { type: 'descriptionEnded', description: description3 },
      { type: 'specEnded', spec: expandedSpec2 },
      { type: 'suiteEnded', suite: suite }
    ])
  })

})
