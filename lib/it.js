var assert = require('assert')

function It (subject) {
  this.subject = subject
}

It.prototype.equals = function (other) {
  assert.equal(this.subject, other)
}

It.prototype.deeplyEquals = function (other) {
  assert.deepEqual(this.subject, other)
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

It.prototype.isLessThan = function (other) {
  assert(this.subject < other)
}

It.prototype.has = function (property) {
  assert(property in this.subject)
  return { that: new It(this.subject[property]) }
}

It.prototype.throws = function (expectedErrorType, expectedErrorMessage) {
  try {
    this.subject()
  } catch (e) {
    if (expectedErrorType) {
      if (!(e instanceof expectedErrorType)) {
        assert(false, 'Expected ' + expectedErrorType.name)
      }
      if (typeof expectedErrorMessage !== 'undefined') {
        assert.equal(e.message, expectedErrorMessage)
      }
    }
  }
}

module.exports = It
