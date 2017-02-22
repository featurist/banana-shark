Feature: Running Specs

  Scenario: Running a single passing spec
    Given the file "spec/singlePassing.js" contains:
      """
      module.exports = describe => {

        describe(
          () => 123,
          it => it.shouldEqual(123)
        )

      }
      """
    When I run "bs spec/singlePassing.js"
    Then it should exit with code 0
    And the output should be:
      """
      ✔ 123 .shouldEqual(123)

      1 passed
      """

  Scenario: Running a single failing spec
    Given the file "spec/singleFailing.js" contains:
      """
      module.exports = describe => {

        describe(
          () => 666,
          it => it.shouldEqual(777)
        )

      }
      """
    When I run "bs spec/singleFailing.js"
    Then it should exit with code 1
    And the output should be:
      """
      ✖ () => 666, it.shouldEqual(777)

     1 failed

     Failures:

     ✖ () => 666, it.shouldEqual(777)
     AssertionError: 666 == 777
          at spec ({workingDirectory}/spec/singleFailing.js:2:9)
      """

  Scenario: Passing and failing
    Given the file "spec/passingAndFailing.js" contains:
      """
      module.exports = describe => {

        describe(() => 1, it => it.shouldEqual(1))
        describe(() => 2, it => it.shouldEqual(2))
        describe(() => 3, it => it.shouldEqual(4))
        describe(() => 5, it => it.shouldEqual(6))

      }
      """
    When I run "bs spec/passingAndFailing.js"
    Then it should exit with code 1
    And the output should be:
      """
      ✔ () => 1, it.shouldEqual(1)
      ✔ () => 2, it.shouldEqual(2)
      ✖ () => 3, it.shouldEqual(4)
      ✖ () => 5, it.shouldEqual(6)

      2 passed
      2 failed

      Failures:

      ✖ () => 3, it.shouldEqual(4)
      3 is not equal to 4
          at spec ({workingDirectory}/spec/passingAndFailing.js:6:9)

      ✖ () => 5, it.shouldEqual(6)
      5 is not equal to 6
          at spec ({workingDirectory}/spec/passingAndFailing.js:9:9)
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
      {workingDirectory}/spec/syntaxError.js:2
      });
        ^
      SyntaxError: Unexpected end of input
      """
