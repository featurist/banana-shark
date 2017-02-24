const Parser = require('./parser')
const Suite = require('./suite')
const Broadcaster = require('./broadcaster')
const PrettyFormatter = require('./prettyFormatter')
const Exiter = require('./exiter')
const path = require('path')

class Cli {

  run (argv) {
    this.results = []
    const listener = new Broadcaster([
      new PrettyFormatter(process.stdout),
      new Exiter()
    ])
    const args = argv.slice(2)
    const suite = { specs: [] }
    return Promise.all(args.map(filePath => {
      try {
        const fullPath = path.join(process.cwd(), filePath)
        const spec = new Parser().parse(require(fullPath))
        spec.path = fullPath
        suite.specs.push(spec)
        return Promise.resolve()
      } catch (e) {
        return Promise.reject(e)
      }
    }))
    .then(() => {
      return new Suite(suite).run(listener)
    })
    .catch(error => {
      listener.unexpectedError(error)
    })
  }

}

module.exports = new Cli()
