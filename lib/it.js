var assert = require('assert')

function It (subject) {
  this.subject = subject
}

It.prototype.equals = function (other) {
  assert.equal(this.subject, other)
}

It.prototype.isPending = function (message) {
  var error = new Error(message || 'assertion pending')
  error.name = 'Pending'
  error.stack = ''
  throw error
}

It.prototype.isGreaterThan = function (other) {
  assert(this.subject > other)
}

It.prototype.has = function (property) {
  return { that: new It(this.subject[property]) }
}

module.exports = It
