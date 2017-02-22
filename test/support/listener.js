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

  specStarted (spec, suite) {
    this.events.push({ type: 'specStarted', spec, suite })
  }

  specEnded (spec, suite) {
    this.events.push({ type: 'specEnded', spec, suite })
  }

  descriptionStarted (description, spec, suite) {
    this.events.push({ type: 'descriptionStarted', description, spec, suite })
  }

  descriptionEnded (description, spec, suite) {
    this.events.push({ type: 'descriptionEnded', description, spec, suite })
  }

  assertionStarted (assertion, description, spec, suite) {
    this.events.push({ type: 'assertionStarted', assertion, description, spec, suite })
  }

  assertionPassed (assertion, description, spec, suite) {
    this.events.push({ type: 'assertionPassed', assertion, description, spec, suite })
  }

  assertionFailed (error, assertion, description, spec, suite) {
    this.events.push({ type: 'assertionFailed', error, assertion, description, spec, suite })
  }
}

module.exports = Listener
