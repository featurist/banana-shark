const it = require('./it')

class Runner {
  constructor(listener) {
    this.listener = listener
  }

  runSpec(spec) {
    this.descriptions = []
    spec(this.describe.bind(this), it)
    this.descriptions.forEach(description => {
      this.runDescription(description)
    })
  }

  describe(factory, ...args) {
    if (!factory) throw new Error('Factory or name is required')
    let name = factory.toString()
    if (typeof factory == 'string' && typeof args[0] == 'function') {
      name = factory
      factory = args[0]
      args = args.slice(1)
    }
    const desc = { name, factory, arguments: args }
    args.forEach(arg => arg.parent = desc)
    this.descriptions.push(desc)
    return desc
  }

  runDescription(description) {
    const path = [description]
    let parent = description.parent
    while (parent) {
      path.unshift(parent)
      parent = parent.parent
    }
    description.arguments.forEach(argument => {
      if (argument.assert) {
        this.runAssertion(path, argument)
      }
    })
  }

  runAssertion(path, argument) {
    const firstWithFactory = path.find(p => typeof p.factory == 'function')
    let subject = firstWithFactory.factory()
    path.slice(path.indexOf(firstWithFactory)).forEach(p => subject = p.factory(subject))
    const result = {}
    const outcome = {
      success: true,
      name: this.joinNames(path.map(x => x.name).concat([argument.stringify(subject)]))
    }
    try {
      argument.assert(subject)
    } catch (error) {
      outcome.error = error
      outcome.stack = error.stack.replace(/\n.+\sat\s.+banana-shark\/it\.js[\s\S]+/gi, '')
      outcome.success = false
    }
    if (outcome.success) {
      this.listener.pass(outcome)
    } else {
      this.listener.fail(outcome)
    }
  }

  joinNames(names) {
    return names.join(', ')
  }
}

exports.Runner = Runner
