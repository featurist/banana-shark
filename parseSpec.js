function parseSpec (spec) {
  const result = {
    descriptions: []
  }
  const describe = (...args) => {
    const description = { assertions: [] }
    if (typeof args[0] === 'string') {
      description.name = args[0]
      args = args.slice(1)
    }
    if (typeof args[0] === 'function') {
      description.factory = args[0]
      args = args.slice(1)
    }
    for (const arg of args) {
      arg.nested = 'assertions' in arg
      description.assertions.push(arg)
    }
    result.descriptions.push(description)
    return description
  }
  spec(describe)
  result.descriptions = result.descriptions.filter(d => {
    const nested = d.nested
    delete d.nested
    return !nested
  })
  return result
}

module.exports = parseSpec
