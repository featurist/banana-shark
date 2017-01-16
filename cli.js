const parseSpec = require('./parseSpec')
const runSuite = require('./runSuite')
const PrettyFormatter = require('./prettyFormatter')
const path = require('path')

class Cli {

  run(argv) {
    this.results = []
    var formatter = new PrettyFormatter(process.stdout)
    const args = argv.slice(2)
    const suite = { specs: [] }
    return Promise.all(args.map(filePath => {
      try {
        const fullPath = path.join(process.cwd(), filePath)
        const spec = parseSpec(require(fullPath))
        spec.path = fullPath
        suite.specs.push(spec)
        return Promise.resolve()
      } catch (e) {
        return Promise.reject(e)
      }
    }))
    .then(() => {
      //console.log(JSON.stringify(suite))
      return runSuite(suite, formatter)
    })
    .catch(error => {
      console.log("ERROR", error)
      process.exit(1)
    })
  }

}



module.exports = new Cli
