const Broadcaster = require('../lib/broadcaster')

function runExample (name) {
  const thrower = {
    assertionFailed (assertion) {
      throw new Error(assertion.describe())
    }
  }
  const listener = new Broadcaster([thrower])
  return require('../cli').runWithListener(
    ['./examples/' + name + '.js'],
    listener
  )
}

describe('examples', function () {

  it('runs the stack example', function () {
    return runExample('stack')
  })

  it('runs the mocha examples', function () {
    return runExample('mocha')
  })

  if (typeof window !== 'undefined') {
    it('runs the browser example', function () {
      return runExample('browser')
    })
  }
})
