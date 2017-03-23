var Spec = require('./spec')

function Suite (ast) {
  this.ast = Suite.expand(ast)
  var suite = this
  this.specs = this.ast.specs.map(function (spec) {
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

Suite.expand = function (ast) {
  var abstracts = findAbstracts(ast.specs)
  replaceStringAssertionsInSpecs(ast.specs, abstracts)
  removeAbstractDescriptions(ast.specs)
  return ast
}

function findAbstracts (specs) {
  var abstracts = {}
  for (var i = 0; i < specs.length; i++) {
    var spec = specs[i]
    for (var j = 0; j < spec.descriptions.length; j++) {
      if ('name' in spec.descriptions[j]) {
        abstracts[spec.descriptions[j].name] = spec.descriptions[j]
      }
    }
  }
  return abstracts
}

function replaceStringAssertionsInSpecs (specs, abstracts) {
  for (var i = 0; i < specs.length; i++) {
    var spec = specs[i]
    replaceStringAssertions(spec.descriptions, abstracts)
  }
}

function replaceStringAssertions (assertions, abstracts) {
  if (!assertions || !assertions.length) return
  for (var i = 0; i < assertions.length; i++) {
    var assertion = assertions[i]
    if (typeof assertions[i] === 'string') {
      assertions[i] = abstracts[assertions[i]]
      if (typeof assertions[i] === 'undefined') {
        assertions[i] = {
          name: assertion,
          assertions: [it => it.isPending(assertion)]
        }
      }
    }
    replaceStringAssertions(assertions[i].assertions, abstracts)
  }
}

function removeAbstractDescriptions (specs) {
  for (var i = 0; i < specs.length; i++) {
    var spec = specs[i]
    spec.descriptions = spec.descriptions.filter(function (d) {
      return hasFactory(d)
    })
  }
}

function hasFactory (description) {
  return (description.factory && description.factory.length === 0) || (
    description.assertions && description.assertions.filter(hasFactory).length > 0
  )
}

module.exports = Suite
