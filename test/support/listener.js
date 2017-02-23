class Listener {
  constructor () {
    this.events = []
  }

  suiteStarted (suite) {
    this.events.push({ type: 'suiteStarted', suite })
  }

  suiteEnded (suite) {
    this.events.push({ type: 'suiteEnded', suite })
  }

  specStarted (spec) {
    this.events.push({ type: 'specStarted', spec })
  }

  specEnded (spec) {
    this.events.push({ type: 'specEnded', spec })
  }

  descriptionStarted (description) {
    this.events.push({ type: 'descriptionStarted', description })
  }

  descriptionEnded (description, spec, suite) {
    this.events.push({ type: 'descriptionEnded', description })
  }

  assertionStarted (assertion) {
    this.events.push({ type: 'assertionStarted', assertion })
  }

  assertionPassed (assertion, description) {
    this.events.push({ type: 'assertionPassed', assertion })
  }

  assertionFailed (assertion, error) {
    this.events.push({ type: 'assertionFailed', assertion, error })
  }
}

module.exports = Listener
