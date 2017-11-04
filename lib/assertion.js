var It = require('./it')

function Assertion (ast, description) {
  this.ast = ast
  this.func = ast
  this.description = description
}

Assertion.prototype.run = function (listener) {
  listener.assertionStarted(this)
  var subject
  try {
    subject = this.description.createSubject()
  } catch (e) {
    listener.assertionFailed(this, e)
    return
  }
  var it = new It(subject)
  var error
  try {
    if (typeof this.func === 'function') {
      this.func(it)
    } else {
      try {
        it.equals(this.func)
      } catch (e) {
        e.stack = ''
        throw e
      }
    }
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
  return this.trail().join(', ')
}

Assertion.prototype.trail = function () {
  return this.description.trail().concat(this.func.toString())
}

module.exports = Assertion
