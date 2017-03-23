const stringifyFunctionsIn = result => {
  delete result.shortStack
  switch (typeof result) {
    case 'function':
      return result.toString()
    case 'object':
      for (const key in result) {
        if (key !== 'run' && key !== 'suite' && key !== 'parent' && key !== 'description') result[key] = stringifyFunctionsIn(result[key])
      }
      return result
    default:
      if (result && result.constructor === Array) {
        return result.map(stringifyFunctionsIn)
      }
      return result
  }
}

module.exports = {
  functionsIn: stringifyFunctionsIn
}
