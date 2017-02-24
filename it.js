var assert = require('assert')

function It (instance) {
  this.instance = instance
}

It.prototype.equals = function (other) {
  assert.equal(this.instance, other)
}

module.exports = It
