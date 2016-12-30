const assert = require('assert')

const itFor = instance => {
  return {
    shouldEqual: other => {
      assert.equal(instance, other)
    }
  }
}

module.exports = itFor
