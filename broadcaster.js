function Broadcaster (listeners) {
  this.listeners = listeners
}

Broadcaster.prototype.suiteStarted = function (suite) {
  this.withEachListener('suiteStarted', suite)
}

Broadcaster.prototype.specStarted = function (spec) {
  this.withEachListener('specStarted', spec)
}

Broadcaster.prototype.descriptionStarted = function (description) {
  this.withEachListener('descriptionStarted', description)
}

Broadcaster.prototype.assertionStarted = function (assertion) {
  this.withEachListener('assertionStarted', assertion)
}

Broadcaster.prototype.assertionPassed = function (assertion) {
  this.withEachListener('assertionPassed', assertion)
}

Broadcaster.prototype.assertionFailed = function (assertion, error) {
  this.withEachListener('assertionFailed', assertion, error)
}

Broadcaster.prototype.descriptionEnded = function (description) {
  this.withEachListener('descriptionEnded', description)
}

Broadcaster.prototype.specEnded = function (spec) {
  this.withEachListener('specEnded', spec)
}

Broadcaster.prototype.suiteEnded = function (suite) {
  this.withEachListener('suiteEnded', suite)
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
