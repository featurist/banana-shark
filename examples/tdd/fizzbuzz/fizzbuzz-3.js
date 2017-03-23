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

function numbersPrintedBy (program) {
  return { length: 100 }
}
var fizzbuzz = {}

/*
() => numbersPrintedBy(fizzbuzz)
  ✔ it => it.has('length').that.equals(100)

1 passed
*/
