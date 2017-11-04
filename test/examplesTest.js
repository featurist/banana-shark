/* eslint-env mocha */

const assert = require('assert')
const Broadcaster = require('../lib/broadcaster')
const CommandLineInterface = require('../lib/CommandLineInterface')

function runExample (name) {
  const errors = []
  const thrower = {
    assertionFailed (assertion) {
      errors.push(new Error(assertion.describe()))
    },
    unexpectedError (error) {
      errors.push(error)
    }
  }
  const listener = new Broadcaster([thrower])
  return new CommandLineInterface().runWithListener(
    ['./examples/' + name + '.js'],
    listener
  )
  .then(result => {
    assert.deepEqual([], errors)
  })
}

describe('examples', function () {

  it('runs the stack example', function () {
    return runExample('stack')
  })

  it('runs the mocha-basic example', function () {
    return runExample('mocha-basic')
  })

  it('runs the mocha-generating example', function () {
    return runExample('mocha-generating')
  })

  it('runs the mocha-shared example', function () {
    return runExample('mocha-shared')
  })

  it('runs the fizzbuzz example', function () {
    return runExample('tdd/fizzbuzz/fizzbuzz-k')
  })

  if (typeof window !== 'undefined') {
    it('runs the browser example', function () {
      return runExample('browser')
    })
  }
})
