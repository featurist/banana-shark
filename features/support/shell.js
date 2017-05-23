const exec = require('child_process').exec

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

module.exports = Shell
