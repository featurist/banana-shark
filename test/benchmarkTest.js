const TempFileSystem = require('../features/support/tempFileSystem')
const Shell = require('../features/support/shell')

function now () {
  const hrTime = process.hrtime()
  return hrTime[0] * 1000000 + hrTime[1] / 1000
}

describe('mocha versus shark', function () {
  beforeEach(function () {
    this.fs = new TempFileSystem()
    this.shell = new Shell(this.fs.getDirectory())
    const iterations = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    const mochaTests = iterations.map(n => ({
      path: `mocha/${n}.js`,
      text: `describe("${n}", function() { it("is true", function() { return true }) })`
    }))
    const bsTests = iterations.map(n => ({
      path: `bs/${n}.js`,
      text: `module.exports = describe => describe("${n}", () => ${n}, it => it.equals(${n}))`
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
