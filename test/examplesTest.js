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

  it('runs the mocha-basic example', function () {
    return runExample('mocha-basic')
  })

  it('runs the mocha-generating example', function () {
    return runExample('mocha-generating')
  })

  it('runs the mocha-shared example', function () {
    return runExample('mocha-shared')
  })

  if (typeof window !== 'undefined') {
    it('runs the browser example', function () {
      return runExample('browser')
    })
  }
})
