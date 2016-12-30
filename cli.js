const Runner = require('.').Runner

class Cli {

  run(argv) {
    this.results = []
    const args = argv.slice(2)
    return Promise.all(args.map(filePath => {
      try {
        const spec = require(process.cwd() + '/' + filePath)
        const args = argv.slice(2)
        const runner = new Runner(this)
        runner.runSpec(spec)
        return Promise.resolve()
      } catch (e) {
        return Promise.reject(e)
      }
    }))
    .then(() => {
      const errorResults = this.results.filter(r => !!r.error)
      const passCount = this.results.filter(r => !r.error).length
      const errorCount = errorResults.length
      const message = (n, status) => `${n} ${status}`
      console.log('')
      if (passCount > 0)  console.log(message(passCount, 'passed'))
      if (errorCount > 0)  {
        console.log(message(errorCount, 'failed'))
        console.log("\nFailures:")
        errorResults.forEach(result => {
          console.log(`\n✖ ${result.name}\n${result.stack}`)
        })
      }
      process.exit(errorCount > 0 ? 1 : 0)
    })
    .catch(errors => {
      console.log(errors)
      process.exit(1)
    })
  }

  fail(result) {
    this.results.push(result)
    console.log('✖ ' + result.name)
  }

  pass(result) {
    this.results.push(result)
    console.log('✔ ' + result.name)
  }

}



module.exports = new Cli
