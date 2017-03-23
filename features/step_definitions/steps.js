const { defineSupportCode } = require('cucumber')
const fs = require('fs')
const exec = require('child_process').exec
const mkdirp = require('mkdirp')
const path = require('path')

class TempFileSystem {
  getDirectory () {
    return process.cwd() + '/tmp'
  }

  writeFile (filePath, contents) {
    const fullPath = this.getDirectory() + '/' + filePath
    return new Promise(function (resolve, reject) {
      mkdirp(path.dirname(fullPath), () => {
        fs.writeFile(fullPath, contents, err => err ? reject(err) : resolve())
      })
    })
  }
}

class Shell {
  constructor (workingDirectory) {
    this.workingDirectory = workingDirectory
  }

  run (command) {
    return new Promise((resolve, reject) => {
      exec(command, { cwd: this.workingDirectory }, (error, stdout, stderr) => {
        const exitCode = error ? 1 : 0
        return resolve({ exitCode, stdout, stderr, error })
      })
    })
  }
}

defineSupportCode(function ({ Before, Given, When, Then }) {

  Before(function () {
    this.fs = new TempFileSystem()
    this.shell = new Shell(this.fs.getDirectory())
  })

  Given('the file {path:stringInDoubleQuotes} contains:', function (path, contents) {
    return this.fs.writeFile(path, contents)
  })

  When('I run {command:stringInDoubleQuotes}', function (command) {
    return this.shell.run(command.replace(/^bs /, '../bin/bs.js '))
      .then(result => { this.result = result })
  })

  Then('it should exit with code {code:int}', function (code) {
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
      throw new Error(`\n${hr}\nexpected:\n${hr}\n${expected}\n${hr}\nactual:\n${hr}\n${actual}\n${hr}`)
    }
  })
})
