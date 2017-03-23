var Assertion = require('./assertion')

function Description (ast, parent) {
  this.ast = ast
  if (ast.name) this.name = ast.name
  if (ast.factory) this.factory = ast.factory
  if (ast.assertions) {
    var self = this
    this.assertions = ast.assertions.map(function (assertion) {
      var A = typeof assertion === 'object' ? Description : Assertion
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
    if (path[i].factory) {
      subject = path[i].factory(subject)
    }
  }
  return subject
}

Description.prototype.trail = function () {
  var crumbs = []
  if ('name' in this) {
    crumbs.push(this.name)
  }
  if ('factory' in this) {
    var factoryString = this.factory.toString()
    if (!Description.isIdentityFunction(factoryString)) {
      crumbs.push(factoryString)
    }
  }
  return this.parent && this.parent.trail
    ? this.parent.trail().concat(crumbs) : crumbs
}

Description.prototype.path = function () {
  var path = [this]
  while ('parent' in path[0]) path = [path[0].parent].concat(path)
  return path
}

Description.isIdentityFunction = function (functionString) {
  var sides = functionString.split('=>')
  return sides.length === 2 && sides[0].trim() === sides[1].trim()
}

module.exports = Description
