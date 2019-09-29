const { Given, When, Then, Before } = require('cucumber')
const TempFileSystem = require('../support/tempFileSystem')
const Shell = require('../support/shell')

Before(function () {
  this.fs = new TempFileSystem()
  this.shell = new Shell(this.fs.getDirectory())
})

Given('the file {string} contains:', function (path, contents) {
  return this.fs.writeFile(path, contents)
})

When('I run {string}', function (command) {
  return this.shell.run(command.replace(/^bs /, '../bin/bs.js '))
    .then(result => { this.result = result })
})

Then('it should exit with code {int}', function (code) {
  if (this.result.exitCode !== code) {
    const output = this.result.stdout.replace(/\n$/, '')
    throw new Error(`Expected to exit with code ${code}, but exited with ${this.result.exitCode}\noutput:\n${output}`)
  }
})

Then('the output should be:', function (output) {
  const expected = output.replace(/\{workingDirectory\}/g, this.fs.getDirectory())
  const actual = this.result.stdout.replace(/\n$/, '')
  const hr = '----------------------------'
  if (expected !== actual) {
    console.log(actual)
    throw new Error(`\n${hr}\nexpected:\n${hr}\n${expected}\n${hr}\nactual:\n${hr}\n${actual}\n${hr}`)
  }
})
