var assert = require('assert')

function It (subject) {
  this.subject = subject
}

It.prototype.equals = function (other) {
  assert.equal(this.subject, other)
}

module.exports = It
