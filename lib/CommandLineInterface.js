const Parser = require('./parser')
const Suite = require('./suite')
const Broadcaster = require('./broadcaster')
const PrettyFormatter = require('./prettyFormatter')
const Exiter = require('./exiter')
const path = require('path')

module.exports = class CommandLineInterface {

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
    const promises = []
    for (var i = 0; i < args.length; i++) {
      try {
        const fullPath = path.join(process.cwd(), args[i])
        const spec = new Parser().parse(require(fullPath))
        spec.path = fullPath
        suite.specs.push(spec)
        promises.push(Promise.resolve())
      } catch (e) {
        promises.push(Promise.reject(e))
      }
    }
    return Promise.all(promises)
    .then(() => {
      return new Suite(suite).run(listener)
    })
    .catch(error => {
      listener.unexpectedError(error)
    })
  }

}
