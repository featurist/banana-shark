// https://mochajs.org/#dynamically-generating-tests

module.exports = describe => {

  describe('add()',
    ...[
      { args: [1, 2], expected: 3 },
      { args: [1, 2, 3], expected: 6 },
      { args: [1, 2, 3, 4], expected: 10 }
    ].map(
      test => describe('correctly adds ' + test.args.length + ' args',
        () => add(...test.args),
        it => it.equals(test.expected)
      )
    )
  )

}

function add () {
  return Array.prototype.slice.call(arguments).reduce(function (prev, curr) {
    return prev + curr
  }, 0)
}
