const { Parser, Suite } = require('.')
const Broadcaster = require('./lib/broadcaster')
const PrettyFormatter = require('./lib/prettyFormatter')
const Exiter = require('./lib/exiter')
const path = require('path')

class Cli {

  run (argv) {
    this.results = []
    const listener = new Broadcaster([
      new PrettyFormatter(process.stdout),
      new Exiter()
    ])
    const args = argv.slice(2)
    this.runWithListener(args, listener)
  }

  runWithListener (args, listener) {
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
