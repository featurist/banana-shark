const itFor = require('./it')

function Assertion (ast, description) {
  this.ast = ast
  this.func = ast
  this.description = description
}

Assertion.prototype.run = function (listener) {
  listener.assertionStarted(this)
  var instance = this.description.factory()
  var it = itFor(instance)
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

module.exports = Assertion
