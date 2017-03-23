var It = require('./it')
var cliPath = require('path').join(__dirname, '..', 'cli.js')

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
    e.shortStack = this.shortenStack(e)
    listener.assertionFailed(this, e)
    return
  }
  var it = new It(subject)
  var error
  try {
    if (typeof this.func === 'function') {
      this.func(it)
    } else {
      it.equals(this.func)
    }
  } catch (e) {
    error = e
  }
  if (error) {
    error.shortStack = this.shortenStack(error)
    listener.assertionFailed(this, error)
  } else {
    listener.assertionPassed(this)
  }
}

Assertion.prototype.shortenStack = function (error) {
  if (error.stack === '') return ''
  var shortStack = []
  var lines = error.stack.split('\n')
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].indexOf(cliPath) > -1) {
      break
    }
    if (lines[i].indexOf(__dirname) > -1) {
      continue
    }
    if (lines[i].indexOf(error.constructor.name + ':') === 0) {
      continue
    }
    shortStack.push(
      '  at ' + lines[i]
        .replace(/^.+\(/, '')
        .replace(/\).*$/, '')
        .replace(process.cwd() + '/', '')
    )
  }
  return shortStack.join('\n')
}

Assertion.prototype.describe = function () {
  return this.trail().join(', ')
}

Assertion.prototype.trail = function () {
  return this.description.trail().concat(this.func.toString())
}

module.exports = Assertion
