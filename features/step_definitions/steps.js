const { defineSupportCode } = require('cucumber')
const fs = require('fs')
const exec = require('child_process').exec
const mkdirp = require('mkdirp')
const path = require('path')
const assert = require('assert')

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
    assert.equal(this.result.exitCode, code)
  })

  Then('the output should be:', function (output) {
    const expandedOutput = output.replace(/\{workingDirectory\}/g, this.fs.getDirectory())
    const hr = '----------------------------'
    assert.equal(this.result.stdout, expandedOutput,
      `expected output:\n${hr}\n${expandedOutput}\n${hr}\n...to be included in stdout:\n${hr}\n${this.result.stdout}\n${hr}`)
  })
})
