function Parser () {
}

Parser.prototype.parse = function (spec) {
  var result = {
    descriptions: []
  }
  function describe () {
    var args = [].slice.apply(arguments)
    var description = { assertions: [] }
    if (typeof args[0] === 'string') {
      description.name = args[0]
      args = args.slice(1)
    }
    if (typeof args[0] === 'function') {
      description.factory = args[0]
      args = args.slice(1)
    }
    for (var i = 0; i < args.length; ++i) {
      var arg = args[i]
      arg.nested = typeof arg === 'object' && 'assertions' in arg
      description.assertions.push(arg)
    }
    result.descriptions.push(description)
    return description
  }
  describe.aspect = function (name) {
    var description = describe(name)
    description.aspect = true
    description.assertions = [].slice.call(arguments, 1)
    return description
  }
  describe.after = function () {
    var description = describe.apply(null, arguments)
    description.after = true
    return description
  }
  spec(describe)
  var filteredDescriptions = []
  for (var i = 0; i < result.descriptions.length; ++i) {
    var nested = result.descriptions[i].nested
    delete result.descriptions[i].nested
    if (!nested) {
      filteredDescriptions.push(result.descriptions[i])
    }
  }
  result.descriptions = filteredDescriptions
  return result
}

module.exports = Parser
