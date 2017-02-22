const stringifyFunctionsIn = result => {
  switch (typeof result) {
    case 'function':
      return result.toString()
    case 'object':
      for (const key in result) {
        result[key] = stringifyFunctionsIn(result[key])
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
