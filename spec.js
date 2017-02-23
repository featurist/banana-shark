var Description = require('./description')

function Spec (ast, suite) {
  this.ast = ast
  var spec = this
  this.descriptions = ast.descriptions.map(function (description) {
    return new Description(description, spec)
  })
  this.suite = suite
}

Spec.prototype.run = function (listener) {
  listener.specStarted(this, this.suite)
  for (var i = 0; i < this.descriptions.length; ++i) {
    this.descriptions[i].run(listener)
  }
  listener.specEnded(this, this.suite)
}

module.exports = Spec
