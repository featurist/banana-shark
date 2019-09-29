Feature: Running Specs

  Scenario: Running a single passing spec
    Given the file "spec/singlePassing.js" contains:
      """
      module.exports = describe =>

        describe(
          () => 123,
          it => it.equals(123)
        )

      """
    When I run "bs spec/singlePassing.js"
    Then it should exit with code 0
    And the output should be:
      """
      () => 123
        ✔ it => it.equals(123)

      1 passed
      """

  Scenario: Running multiple passing specs
    Given the file "spec/multiplePassing1.js" contains:
      """
      module.exports = describe =>

        describe(
          () => 'one',
          it => it.equals('one')
        )

      """
    And the file "spec/multiplePassing2.js" contains:
      """
      module.exports = describe =>

        describe(
          () => 'two',
          it => it.equals('two')
        )

      """
    When I run "bs spec/multiplePassing1.js spec/multiplePassing2.js"
    Then it should exit with code 0
    And the output should be:
      """
      () => 'one'
        ✔ it => it.equals('one')
      () => 'two'
        ✔ it => it.equals('two')

      2 passed
      """

  Scenario: Running a single failing spec
    Given the file "spec/singleFailing.js" contains:
      """
      module.exports = describe =>

        describe(
          () => 666,
          it => it.equals(777)
        )

      """
    When I run "bs spec/singleFailing.js"
    Then it should exit with code 1
    And the output should be:
      """
      () => 666
        ✖ it => it.equals(777)

      1 failed

      () => 666
        ✖ it => it.equals(777)
      AssertionError: Expected values to be strictly equal:

      666 !== 777

          at Assertion.<anonymous> (spec/singleFailing.js:5:14)
      """

  Scenario: Passing and failing
    Given the file "spec/passingAndFailing.js" contains:
      """
      module.exports = describe => {

        describe(() => 1, it => it.equals(1))
        describe(() => 2, it => it.equals(2))
        describe(() => 3, it => it.equals(4))
        describe(() => 5, it => it.equals(6))

      }
      """
    When I run "bs spec/passingAndFailing.js"
    Then it should exit with code 1
    And the output should be:
      """
      () => 1
        ✔ it => it.equals(1)
      () => 2
        ✔ it => it.equals(2)
      () => 3
        ✖ it => it.equals(4)
      () => 5
        ✖ it => it.equals(6)

      2 passed, 2 failed

      () => 3
        ✖ it => it.equals(4)
      AssertionError: Expected values to be strictly equal:

      3 !== 4

          at Assertion.<anonymous> (spec/passingAndFailing.js:5:30)

      () => 5
        ✖ it => it.equals(6)
      AssertionError: Expected values to be strictly equal:

      5 !== 6

          at Assertion.<anonymous> (spec/passingAndFailing.js:6:30)
      """

  Scenario: Running a single spec with a syntax error
    Given the file "spec/syntaxError.js" contains:
      """
      decribe('this is invalid', () => {
      """
    When I run "bs spec/syntaxError.js"
    Then it should exit with code 1
    And the output should be:
      """
      {workingDirectory}/spec/syntaxError.js:1
      decribe('this is invalid', () => {
                                        

      SyntaxError: Unexpected end of input
      """

  Scenario: Running a single spec with a reference error in the factory
    Given the file "spec/referenceErrorInFactory.js" contains:
      """
      module.exports = describe => {
        describe(
          () => wtf(),
          it => it.equals(99)
        )
        describe(
          () => omg(),
          it => it.equals(99)
        )
        describe(
          () => zomg(),
          it => it.equals(99)
        )
        describe(
          () => 99,
          it => it.equals(99)
        )
      }

      function omg () { return wtf() }
      var zomg = require('./zomg')
      """
    And the file "spec/zomg.js" contains:
      """
      module.exports = () => wtf
      """
    When I run "bs spec/referenceErrorInFactory.js"
    Then it should exit with code 1
    And the output should be:
      """
      () => wtf()
        ✖ it => it.equals(99)
      () => omg()
        ✖ it => it.equals(99)
      () => zomg()
        ✖ it => it.equals(99)
      () => 99
        ✔ it => it.equals(99)

      1 passed, 3 failed

      () => wtf()
        ✖ it => it.equals(99)
      ReferenceError: wtf is not defined
          at Description.factory (spec/referenceErrorInFactory.js:3:11)

      () => omg()
        ✖ it => it.equals(99)
      ReferenceError: wtf is not defined
          at omg (spec/referenceErrorInFactory.js:20:19)
          at Description.factory (spec/referenceErrorInFactory.js:7:11)

      () => zomg()
        ✖ it => it.equals(99)
      ReferenceError: wtf is not defined
          at module.exports (spec/zomg.js:1:24)
          at Description.factory (spec/referenceErrorInFactory.js:11:11)
      """

  Scenario: Running a single nested passing spec
    Given the file "spec/singleNested.js" contains:
      """
      module.exports = describe =>

        describe(
          () => 665,
          describe(
            n => n + 1,
            it => it.equals(666)
          )
        )

      """
    When I run "bs spec/singleNested.js"
    Then it should exit with code 0
    And the output should be:
      """
      () => 665
        n => n + 1
          ✔ it => it.equals(666)

      1 passed
      """

  Scenario: Running a single spec with a literal equals assertion
    Given the file "spec/numberAsAssertion.js" contains:
      """
      module.exports = describe => {
        describe(
          () => fizzbuzz(),
          describe(
            'prints 100 lines',
            lines => lines.length,
            100
          )
        )
      }

      function fizzbuzz () {
        return []
      }
      """
    When I run "bs spec/numberAsAssertion.js"
    Then it should exit with code 1
    And the output should be:
      """
      () => fizzbuzz()
        prints 100 lines
          lines => lines.length
            ✖ 100

      1 failed

      () => fizzbuzz()
        prints 100 lines
          lines => lines.length
            ✖ 100
      AssertionError: Expected values to be strictly equal:

      0 !== 100

      """

  Scenario: Running a single nested passing spec
    Given the file "spec/singleNested.js" contains:
      """
      module.exports = describe =>

        describe(
          () => 665,
          describe(
            n => n + 1,
            it => it.equals(666)
          )
        )

      """
    When I run "bs spec/singleNested.js"
    Then it should exit with code 0
    And the output should be:
      """
      () => 665
        n => n + 1
          ✔ it => it.equals(666)

      1 passed
      """
