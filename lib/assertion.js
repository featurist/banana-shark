var It = require('./it')

function Assertion (ast, description) {
  this.ast = ast
  this.func = ast
  this.description = description
}

Assertion.prototype.run = function (listener) {
  listener.assertionStarted(this)
  var subject = this.description.createSubject()
  var it = new It(subject)
  var error
  try {
    this.func(it)
  } catch (e) {
    error = e
  }
  if (error) {
    listener.assertionFailed(this, error)
  } else {
    listener.assertionPassed(this)
  }
}

Assertion.prototype.describe = function () {
  return this.description.describe() + ', ' + this.func.toString()
}

Assertion.prototype.trail = function () {
  return this.description.trail().concat(this.func.toString())
}

module.exports = Assertion
