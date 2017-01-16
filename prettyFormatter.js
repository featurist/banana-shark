function PrettyFormatter(output) {
  this.output = output
  this.depth = -2
}

PrettyFormatter.prototype.suiteStarted = function() {
}

PrettyFormatter.prototype.specStarted = function(spec) {
  this.depth++
}

PrettyFormatter.prototype.descriptionStarted = function(description) {
  this.depth++
}

PrettyFormatter.prototype.assertionStarted = function() {
}

PrettyFormatter.prototype.assertionPassed = function(assertion, description) {
  this.writeLine('✔ ' + (description.name || description.factory.toString().replace('() =>', '')) + ', ' + assertion.toString())
}

PrettyFormatter.prototype.assertionFailed = function(error, assertion, description) {
  this.writeLine('✖ ' + (description.name || description.factory.toString().replace('() =>', '')) + ', ' + assertion.toString())
  this.writeLine('   at ' + error.stack.split("\n")[2].replace(/^.+\(/, '').replace(/\).*$/, '').replace(process.cwd() + '/', ''))
}

PrettyFormatter.prototype.descriptionEnded = function() {
  this.depth--
}

PrettyFormatter.prototype.specEnded = function(spec) {
  this.depth--
}

PrettyFormatter.prototype.suiteEnded = function() {
}

PrettyFormatter.prototype.writeLine = function(line) {
  this.write(line + "\n")
}

PrettyFormatter.prototype.write = function(output) {
  var indent = ''
  for (var i = 0; i < this.depth; i++) {
    indent += '  '
  }
  this.output.write(indent + output)
}

module.exports = PrettyFormatter
