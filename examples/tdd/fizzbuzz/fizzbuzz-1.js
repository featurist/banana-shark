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

/*
() => numbersPrintedBy(fizzbuzz)
  ✖ it => it.has('length').that.equals(100)

1 failed

() => numbersPrintedBy(fizzbuzz)
  ✖ it => it.has('length').that.equals(100)
ReferenceError: numbersPrintedBy is not defined
  at examples/tdd/fizzbuzz/fizzbuzz-1.js:9:11
*/
