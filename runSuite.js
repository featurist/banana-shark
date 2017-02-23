const itFor = require('./it')

function runSuite (_suite, listener) {
  listener.suiteStarted(_suite)
  for (let i = 0; i < _suite.specs.length; ++i) {
    spec(_suite.specs[i], _suite, listener)
  }
  listener.suiteEnded(_suite)
}

function spec (_spec, suite, listener) {
  listener.specStarted(_spec, suite)
  for (let i = 0; i < _spec.descriptions.length; ++i) {
    description(_spec.descriptions[i], _spec, suite, listener)
  }
  listener.specEnded(_spec, suite)
}

function description (_description, spec, suite, listener) {
  listener.descriptionStarted(_description, spec, suite)
  for (let i = 0; i < _description.assertions.length; ++i) {
    assertion(_description.assertions[i], _description, spec, suite, listener)
  }
  listener.descriptionEnded(_description, spec, suite)
}

function assertion (_assertion, _description, spec, suite, listener) {
  if (typeof _assertion === 'function') {
    listener.assertionStarted(_assertion, _description, spec, suite)
    const instance = _description.factory()
    const it = itFor(instance)
    let error
    try {
      _assertion(it)
    } catch (e) {
      error = e
    }
    if (error) {
      listener.assertionFailed(error, _assertion, _description, spec, suite)
    } else {
      listener.assertionPassed(_assertion, _description, spec, suite)
    }
  } else {
    description(_assertion, spec, suite, listener)
  }
}

module.exports = runSuite
