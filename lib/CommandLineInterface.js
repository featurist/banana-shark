const Parser = require('./parser')
const Suite = require('./suite')
const Broadcaster = require('./broadcaster')
const PrettyFormatter = require('./prettyFormatter')
const Exiter = require('./exiter')
const path = require('path')

module.exports = class CommandLineInterface {

  constructor ({ parser, listener } = {}) {
    this.parser = parser || new Parser()
    this.listener = listener || new Broadcaster([
      new PrettyFormatter(process.stdout),
      new Exiter()
    ])
  }

  run ({ paths }) {
    const specs = []
    return Promise.all(paths.map(relativePath =>
      this.parseSpec(relativePath).then(spec => specs.push(spec))
    ))
      .then(() => new Suite({ specs }).run(this.listener))
      .catch(error => { this.listener.unexpectedError(error) })
  }

  parseSpec (relativePath) {
    try {
      const fullPath = path.join(process.cwd(), relativePath)
      const spec = this.parser.parse(require(fullPath))
      spec.path = fullPath
      return Promise.resolve(spec)
    } catch (e) {
      return Promise.reject(e)
    }
  }
}
