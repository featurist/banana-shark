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
  var aspects = findAspects(ast.specs)
  replaceStringAssertionsInSpecs(ast.specs, aspects)
  removeAspectDescriptions(ast.specs)
  return ast
}

function findAspects (specs) {
  var aspects = {}
  for (var i = 0; i < specs.length; i++) {
    var spec = specs[i]
    for (var j = 0; j < spec.descriptions.length; j++) {
      if (spec.descriptions[j].aspect) {
        aspects[spec.descriptions[j].name] = spec.descriptions[j]
      }
    }
  }
  return aspects
}

function replaceStringAssertionsInSpecs (specs, aspects) {
  for (var i = 0; i < specs.length; i++) {
    replaceStringAssertions(specs[i].descriptions, aspects)
  }
}

function replaceStringAssertions (assertions, aspects) {
  if (!assertions || !assertions.length) return
  for (var i = 0; i < assertions.length; i++) {
    var assertion = assertions[i]
    if (typeof assertion === 'string') {
      assertions[i] = aspects[assertion]
      if (typeof assertions[i] === 'undefined') {
        var aspect = { aspect: assertion }
        assertions[i] = {
          name: assertion,
          assertions: [it => it.isPending(aspect)]
        }
      }
    }
    replaceStringAssertions(assertions[i].assertions, aspects)
  }
}

function removeAspectDescriptions (specs) {
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
