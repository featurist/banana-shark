function shortStack (error) {
  if (error.stack === '') return ''
  var newStack = []
  var lines = error.stack.split('\n')
  let foundUserStack = false
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].indexOf(__dirname) > -1) {
      if (foundUserStack) {
        break
      } else {
        continue
      }
    } else if (lines[i].match(/^\s+at\s/)) {
      foundUserStack = true
      newStack.push(
        lines[i]
          .replace('    at Description.describe [as factory]', '    at describe')
          .replace('    at Assertion.it', '    at it')
          .replace(process.cwd() + '/', '')
      )
    }
  }
  return newStack.join('\n')
}

module.exports = shortStack
