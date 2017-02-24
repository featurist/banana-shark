var Assertion = require('./assertion')

function Description (ast, parent) {
  this.ast = ast
  if (ast.name) this.name = ast.name
  if (ast.factory) this.factory = ast.factory
  if (ast.assertions) {
    var self = this
    this.assertions = ast.assertions.map(function (assertion) {
      var A = typeof assertion === 'function' ? Assertion : Description
      return new A(assertion, self)
    })
  }
  this.parent = parent
}

Description.prototype.run = function (listener) {
  var suite = this
  while (suite.parent) suite = suite.parent
  suite = suite.suite
  listener.descriptionStarted(this)
  for (var i = 0; i < this.assertions.length; ++i) {
    this.assertions[i].run(listener)
  }
  listener.descriptionEnded(this)
}

Description.prototype.createSubject = function () {
  var path = this.path()
  var subject
  for (var i = 0; i < path.length; i++) {
    if (path[i].factory) subject = path[i].factory(subject)
  }
  return subject
}

Description.prototype.describe = function () {
  var description = this.name || this.factory.toString()
  return this.parent && this.parent.describe ? ([this.parent.describe()].concat(description)).join(', ') : description
}

Description.prototype.path = function () {
  var path = [this]
  while ('parent' in path[0]) path = [path[0].parent].concat(path)
  return path
}

module.exports = Description
