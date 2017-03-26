var shortStack = require('./shortStack')

function PrettyFormatter (output) {
  this.output = output
  this.passCount = 0
  this.errors = []
  this.lastTrail = []
}

PrettyFormatter.prototype.assertionPassed = function (assertion) {
  var trail = assertion.trail()
  this.writeTrail(trail, '✔')
  this.passCount++
  this.lastTrail = trail
}

PrettyFormatter.prototype.assertionFailed = function (assertion, error) {
  var trail = assertion.trail()
  this.writeTrail(trail, '✖')
  this.errors.push({ trail, error })
  this.lastTrail = trail
}

PrettyFormatter.prototype.suiteEnded = function () {
  this.lastTrail = []
  this.writeLine('')
  var summary = []
  if (this.passCount > 0) summary.push(`${this.passCount} passed`)
  if (this.errors.length > 0) summary.push(`${this.errors.length} failed`)
  this.writeLine(summary.join(', '))
  if (this.errors.length > 0) {
    this.errors.forEach(function (e) {
      this.writeLine('')
      this.writeTrail(e.trail, '✖')
      this.writeError(e.error)
    }.bind(this))
  }
}

PrettyFormatter.prototype.unexpectedError = function (error) {
  if (error.name === 'SyntaxError') {
    this.writeLine(error.stack.replace(/\s+at.+\n?/g, ''))
  } else {
    this.writeError(error)
  }
}

PrettyFormatter.prototype.writeError = function (error) {
  this.writeLine(error.name + ': ' + error.message)
  var stack = shortStack(error)
  if (stack !== '') {
    this.writeLine(stack)
  }
}

PrettyFormatter.prototype.writeTrail = function (trail, symbol) {
  var indent = ''
  var spaces = '  '
  for (var i = 0; i < trail.length - 1; i++) {
    if (trail[i] !== this.lastTrail[i]) { break }
    indent += spaces
  }
  for (; i < trail.length - 1; i++) {
    this.writeLine(indent + trail[i])
    indent += spaces
  }
  this.writeLine(indent + symbol + ' ' + trail[trail.length - 1])
}

PrettyFormatter.prototype.writeLine = function (line) {
  this.output.write(line + '\n')
}

module.exports = PrettyFormatter
