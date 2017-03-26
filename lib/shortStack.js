var cliPath = require('path').join(__dirname, '..', 'cli.js')

function shortStack (error) {
  if (error.stack === '') return ''
  var newStack = []
  var lines = error.stack.split('\n')
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].indexOf(cliPath) > -1) {
      break
    }
    if (lines[i].indexOf(__dirname) > -1) {
      continue
    }
    if (/^\s+at\s/.test(lines[i])) {
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
