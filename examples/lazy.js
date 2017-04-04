module.exports = describe => {
  describe(
    () => new Lazy()
          .add(function timesTwo (a) { return a * 2 })
          .add(function plus (a, b) { return a + b }, 1)
          .evaluate([1, 2, 3]),
    it => it.deeplyEquals([3, 5, 7])
  )
}

function Lazy (fn) {
  this.fn = fn || (x => x)
}

Lazy.prototype.add = function (fn) {
  return new Lazy(
    n => fn.apply(this, [this.fn(n)].concat([].slice.call(arguments, 1)))
  )
}

Lazy.prototype.evaluate = function (input) {
  return input.map(this.fn)
}
