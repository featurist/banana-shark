module.exports = describe => {
  describe(
    () => new Lazy(),
    describe(
      lazy => lazy.evaluate([1, 2, 3]),
      it => it.deeplyEquals([1, 2, 3])
    ),
    describe(
      lazy => lazy.add(function timesTwo (a) { return a * 2 }),
      describe(
        lazy => lazy.evaluate([1, 2, 3]),
        it => it.deeplyEquals([2, 4, 6])
      ),
      describe(
        lazy => lazy.add(function plus (a, b) { return a + b }, 1),
        describe(
          lazy => lazy.evaluate([1, 2, 3]),
          it => it.deeplyEquals([3, 5, 7])
        )
      )
    )
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
