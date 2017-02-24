var Spec = require('./spec')

function Suite (ast) {
  this.ast = ast
  var suite = this
  this.specs = ast.specs.map(function (spec) {
    return new Spec(spec, suite)
  })
}

Suite.prototype.run = function (listener) {
  listener.suiteStarted(this)
  for (var i = 0; i < this.specs.length; ++i) {
    this.specs[i].run(listener)
  }
  listener.suiteEnded(this)
}

module.exports = Suite
