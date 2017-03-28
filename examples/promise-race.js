const Promise = require('finished-promise')

module.exports = describe => {

  describe(
    () => new PromiseRace(
      new Promise(resolve => resolve(1)),
      new Promise(resolve => resolve(2))
    ),
    describe(
      'when promise 1 finishes',
      race => race.whenNthFinishes(1),
      it => it.has('result').that.equals(1),
      describe(
        'then promise 2 finishes',
        race => race.whenNthFinishes(2),
        it => it.has('result').that.equals(1)
      )
    ),
    describe(
      'when promise 2 finishes',
      race => race.whenNthFinishes(2),
      it => it.has('result').that.equals(2),
      describe(
        'then promise 1 finishes',
        race => race.whenNthFinishes(1),
        it => it.has('result').that.equals(2)
      )
    )
  )

  describe(
    () => new PromiseRace(
      new Promise(resolve => resolve(1)),
      new Promise((resolve, reject) => reject(new Error('2')))
    ),
    describe(
      'when promise 1 finishes',
      race => race.whenNthFinishes(1),
      it => it.has('result').that.equals(1),
      describe(
        'then promise 2 finishes',
        race => race.whenNthFinishes(2),
        it => it.has('result').that.equals(1)
      )
    ),
    describe(
      'when promise 2 finishes',
      race => race.whenNthFinishes(2),
      it => it.has('error').that.has('message').that.equals('2'),
      describe(
        'then promise 1 finishes',
        race => race.whenNthFinishes(1),
        it => it.has('error').that.has('message').that.equals('2')
      )
    )
  )

}

function PendingPromise (underlyingPromise) {
  underlyingPromise.then(result => {
    this.result = result
  })
  underlyingPromise.catch(error => {
    this.error = error
  })
  this.resolveHandlers = []
  this.rejectHandlers = []
}

PendingPromise.prototype.finish = function () {
  if (this.error) {
    this.rejectHandlers.forEach(handler => handler(this.error))
  } else {
    this.resolveHandlers.forEach(handler => handler(this.result))
  }
}

PendingPromise.prototype.then = function (resolveHandler) {
  this.resolveHandlers.push(resolveHandler)
  return this
}

PendingPromise.prototype.catch = function (rejectHandler) {
  this.rejectHandlers.push(rejectHandler)
  return this
}

function PromiseRace () {
  let finished = false
  this.promises = [].slice.apply(arguments).map(
    p => new PendingPromise(p)
      .then(result => {
        if (!finished) this.result = result
        finished = true
      })
      .catch(error => {
        if (!finished) this.error = error
        finished = true
      })
  )
}

PromiseRace.prototype.whenNthFinishes = function (n) {
  this.promises[n - 1].finish()
  return this
}
