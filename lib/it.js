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
  var name = 'Pending'
  if (typeof message === 'object' && 'aspect' in message) {
    message = message.aspect
    name = 'Pending aspect'
  }
  var error = new Error(message || 'assertion pending')
  error.name = name
  error.stack = ''
  throw error
}

It.prototype.isGreaterThan = function (other) {
  assert(this.subject > other, this.subject.toString() + ' > ' + other.toString())
}

It.prototype.isLessThan = function (other) {
  assert(this.subject < other, this.subject.toString() + ' < ' + other.toString())
}

It.prototype.has = function (property) {
  assert(property in this.subject, "Expected property '" + property + "'")
  return { that: new It(this.subject[property]) }
}

It.prototype.throws = function (expectedErrorType, expectedErrorMessage) {
  try {
    this.subject()
  } catch (e) {
    if (expectedErrorType) {
      if (!(e instanceof expectedErrorType)) {
        var message = [
          'Expected',
          expectedErrorType.name + ',',
          'but',
          e.constructor.name,
          'was thrown'
        ].join(' ')
        assert(false, message)
      }
      if (typeof expectedErrorMessage !== 'undefined') {
        assert.equal(e.message, expectedErrorMessage)
      }
    }
  }
}

module.exports = It
