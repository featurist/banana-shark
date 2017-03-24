/*
Write a program that prints the numbers from 1 to 100. But for multiples of
three print “Fizz” instead of the number and for the multiples of five print
“Buzz”. For numbers which are multiples of both three and five print “FizzBuzz”.
*/

module.exports = describe => {
  describe(
    () => numbersPrintedBy(fizzbuzz),
    it => it.has('length').that.equals(100),
    describe(
      numbers => numbers[0],
      it => it.equals(1)
    )
  )
}

function numbersPrintedBy (program) {
  return { length: 100 }
}
var fizzbuzz = {}

/*
() => numbersPrintedBy(fizzbuzz)
  ✔ it => it.has('length').that.equals(100)
  numbers => numbers[0]
    ✖ it => it.equals(1)

1 passed, 1 failed

() => numbersPrintedBy(fizzbuzz)
  numbers => numbers[0]
    ✖ it => it.equals(1)
AssertionError: undefined == 1
  at examples/tdd/fizzbuzz/fizzbuzz-d.js:13:16
*/
