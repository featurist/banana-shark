/* eslint-env mocha */

const TempFileSystem = require('../features/support/tempFileSystem')
const Shell = require('../features/support/shell')

function now () {
  const hrTime = process.hrtime()
  return hrTime[0] * 1000000 + hrTime[1] / 1000
}

function runMochaTest () {
  const assert = require('assert')

  describe('some things', function () {
    before(function () {
      this.x = 123
    })

    it('does some stuff', function () {
      assert.strictEqual(this.x, 123)
    })
  })
}

function runSharkTest () {
  module.exports = describe => {
    describe('some things',
      () => 123,
      it => it.equals(123)
    )
  }
}

describe('mocha versus shark', function () {
  before(function () {
    this.fs = new TempFileSystem()
    this.shell = new Shell(this.fs.getDirectory())
    const iterations = []
    for (var i = 0; i < 50; i++) {
      iterations.push(i)
    }
    const mochaTests = iterations.map(n => ({
      path: `mocha/${n}.js`,
      text: `${runMochaTest.toString()}; runMochaTest()`
    }))
    const bsTests = iterations.map(n => ({
      path: `bs/${n}.js`,
      text: `${runSharkTest.toString()}; runSharkTest()`
    }))
    return Promise.all(
      mochaTests.concat(bsTests).map(file => this.fs.writeFile(file.path, file.text))
    )
  })
  it('runs the tests in mocha', function () {
    const startTime = now()
    return this.shell.run('../node_modules/.bin/mocha mocha')
      .catch(e => { throw e })
      .then(() => console.log('mocha', now() - startTime))
  })
  it('runs the tests in bs', function () {
    const startTime = now()
    return this.shell.run('../bin/bs.js bs/*.js')
      .catch(e => { throw e })
      .then(() => console.log('shark', now() - startTime))
  })
})
