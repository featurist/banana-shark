const fs = require('fs')
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

module.exports = TempFileSystem
