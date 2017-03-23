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
    ),
    describe(
      numbers => numbers[2],
      it => it.equals('Fizz')
    )
  )
}

function numbersPrintedBy (program) {
  var numbers = []
  var printer = { print (number) { numbers.push(number) } }
  program.printNumbersTo(printer)
  return numbers
}
var fizzbuzz = {
  printNumbersTo (printer) {
    for (var i = 1; i <= 100; i++) {
      printer.print(i)
    }
  }
}

/*
() => numbersPrintedBy(fizzbuzz)
  ✔ it => it.has('length').that.equals(100)
  numbers => numbers[0]
    ✔ it => it.equals(1)
  numbers => numbers[2]
    ✖ it => it.equals('Fizz')

2 passed, 1 failed

() => numbersPrintedBy(fizzbuzz)
  numbers => numbers[2]
    ✖ it => it.equals('Fizz')
AssertionError: 3 == 'Fizz'
  at examples/tdd/fizzbuzz/fizzbuzz-6.js:17:16
*/
