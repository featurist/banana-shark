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
      ✔ () => 123, it => it.equals(123)

      1 passed
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
      ✖ () => 666, it => it.equals(777)

      1 failed

      ✖ () => 666, it => it.equals(777)
        AssertionError: 666 == 777
        at spec/singleFailing.js:5:14
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
      ✔ () => 1, it => it.equals(1)
      ✔ () => 2, it => it.equals(2)
      ✖ () => 3, it => it.equals(4)
      ✖ () => 5, it => it.equals(6)

      2 passed, 2 failed

      ✖ () => 3, it => it.equals(4)
        AssertionError: 3 == 4
        at spec/passingAndFailing.js:5:30

      ✖ () => 5, it => it.equals(6)
        AssertionError: 5 == 6
        at spec/passingAndFailing.js:6:30
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
      ✔ () => 665, n => n + 1, it => it.equals(666)

      1 passed
      """

  Scenario: Running behaves-like specs
    Given the file "spec/behavesLike.js" contains:
      """
      module.exports = describe => {

        describe(
          () => 42,
          'the meaning of life',
          'fourty three minus one'
        )

        describe(
          'the meaning of life',
          number => number,
          it => it.equals(42)
        )

        describe(
          'fourty three minus one',
          number => number,
          it => it.equals(43 - 1)
        )

      }
      """
    When I run "bs spec/behavesLike.js"
    Then it should exit with code 0
    And the output should be:
      """
      ✔ () => 42, the meaning of life, it => it.equals(42)
      ✔ () => 42, fourty three minus one, it => it.equals(43 - 1)

      2 passed
      """

  Scenario: Behaves-like behaves-like specs
    Given the file "spec/behavesLikeBehavesLike.js" contains:
      """
      module.exports = describe => {

        describe(
          () => 42,
          'the meaning of life'
        )

        describe(
          'the meaning of life',
          'fourty three minus one'
        )

        describe(
          'fourty three minus one',
          number => number,
          it => it.equals(43 - 1)
        )

      }
      """
    When I run "bs spec/behavesLikeBehavesLike.js"
    Then it should exit with code 0
    And the output should be:
      """
      ✔ () => 42, the meaning of life, fourty three minus one, it => it.equals(43 - 1)

      1 passed
      """

  Scenario: Pending behaves-like specs
    Given the file "spec/pendingBehavesLike.js" contains:
      """
      module.exports = describe => {

        describe(
          () => 42,
          'the meaning of life'
        )

      }
      """
    When I run "bs spec/pendingBehavesLike.js"
    Then it should exit with code 1
    And the output should be:
      """
      ✖ () => 42, the meaning of life, it => it.isPending(assertion)

      1 failed

      ✖ () => 42, the meaning of life, it => it.isPending(assertion)
        Pending: the meaning of life
      """
