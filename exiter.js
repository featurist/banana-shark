function Exiter () {
  this.exitCode = 0
}

Exiter.prototype.assertionFailed = function () {
  this.exitCode++
}

Exiter.prototype.suiteEnded = function () {
  process.exit(this.exitCode)
}

Exiter.prototype.unexpectedError = function () {
  process.exit(1)
}

module.exports = Exiter
