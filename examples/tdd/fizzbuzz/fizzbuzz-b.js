/*
Write a program that prints the numbers from 1 to 100. But for multiples of
three print “Fizz” instead of the number and for the multiples of five print
“Buzz”. For numbers which are multiples of both three and five print “FizzBuzz”.
*/

module.exports = describe => {
  describe(
    () => numbersPrintedBy(fizzbuzz),
    it => it.has('length').that.equals(100)
  )
}

function numbersPrintedBy (program) {}
var fizzbuzz = {}

/*
() => numbersPrintedBy(fizzbuzz)
  ✖ it => it.has('length').that.equals(100)

1 failed

() => numbersPrintedBy(fizzbuzz)
  ✖ it => it.has('length').that.equals(100)
TypeError: Cannot use 'in' operator to search for 'length' in undefined
  at examples/tdd/fizzbuzz/fizzbuzz-b.js:10:1
*/
