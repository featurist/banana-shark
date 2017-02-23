function Broadcaster (listeners) {
  this.listeners = listeners
}

Broadcaster.prototype.suiteStarted = function () {
  this.withEachListener('suiteStarted')
}

Broadcaster.prototype.specStarted = function (spec) {
  this.withEachListener('specStarted', spec)
}

Broadcaster.prototype.descriptionStarted = function (description) {
  this.withEachListener('descriptionStarted', description)
}

Broadcaster.prototype.assertionStarted = function () {
  this.withEachListener('assertionStarted')
}

Broadcaster.prototype.assertionPassed = function (assertion, description) {
  this.withEachListener('assertionPassed', assertion, description)
}

Broadcaster.prototype.assertionFailed = function (error, assertion, description) {
  this.withEachListener('assertionFailed', error, assertion, description)
}

Broadcaster.prototype.descriptionEnded = function () {
  this.withEachListener('descriptionEnded')
}

Broadcaster.prototype.specEnded = function (spec) {
  this.withEachListener('specEnded', spec)
}

Broadcaster.prototype.suiteEnded = function () {
  this.withEachListener('suiteEnded')
}

Broadcaster.prototype.unexpectedError = function (error) {
  this.withEachListener('unexpectedError', error)
}

Broadcaster.prototype.withEachListener = function (method) {
  var args = [].slice.call(arguments, 1)
  this.listeners.forEach(function (listener) {
    if (listener[method]) {
      try {
        listener[method].apply(listener, args)
      } catch (e) {
        console.log('Error in listener:', e)
      }
    }
  })
}

module.exports = Broadcaster
