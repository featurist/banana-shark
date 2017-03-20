function PrettyFormatter (output) {
  this.output = output
  this.depth = -2
  this.passCount = 0
  this.errors = []
}

PrettyFormatter.prototype.assertionPassed = function (assertion) {
  this.passCount++
  var bullet = '✔ ' + assertion.describe()
  this.writeLine(bullet)
}

PrettyFormatter.prototype.assertionFailed = function (assertion, error) {
  var bullet = '✖ ' + assertion.describe()
  this.errors.push({ error, bullet })
  this.writeLine(bullet)
}

PrettyFormatter.prototype.suiteEnded = function () {
  this.writeLine('')
  var summary = []
  if (this.passCount > 0) summary.push(`${this.passCount} passed`)
  if (this.errors.length > 0) summary.push(`${this.errors.length} failed`)
  this.writeLine(summary.join(', '))
  if (this.errors.length > 0) {
    this.errors.forEach(function (e) {
      this.writeLine('')
      this.writeLine(e.bullet)
      this.writeError(e.error)
    }.bind(this))
  }
}

PrettyFormatter.prototype.unexpectedError = function (error) {
  if (error.name === 'SyntaxError') {
    this.writeLine(error.stack.replace(/\s+at.+\n?/g, ''))
  } else {
    this.writeLine(error.stack)
  }
}

PrettyFormatter.prototype.writeError = function (error) {
  this.writeLine('  ' + error.name + ': ' + error.message)
  if (error.stack !== '') {
    this.writeLine('  at ' + error.stack.split('\n')[2].replace(/^.+\(/, '').replace(/\).*$/, '').replace(process.cwd() + '/', ''))
  }
}

PrettyFormatter.prototype.writeLine = function (line) {
  this.write(line + '\n')
}

PrettyFormatter.prototype.write = function (output) {
  var indent = ''
  for (var i = 0; i < this.depth; i++) {
    indent += '  '
  }
  this.output.write(indent + output)
}

module.exports = PrettyFormatter
