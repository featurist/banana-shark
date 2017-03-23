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
      AssertionError: 3 == 4
      at spec/passingAndFailing.js:5:30

      () => 5
        ✖ it => it.equals(6)
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
      () => 665
        n => n + 1
          ✔ it => it.equals(666)

      1 passed
      """

  Scenario: Running behaves-like specs
    Given the file "spec/behavesLike.js" contains:
      """
      module.exports = describe => {

        describe('User',
          () => new User('bob'),
          'behaves like a user'
        )

        describe('Admin',
          () => new Admin('bob'),
          'behaves like a user'
        )

        describe('behaves like a user',
          describe(
            user => user.name,
            it => it.equals('bob')
          )
        )

        function User(name) { this.name = name }
        var Admin = User

      }
      """
    When I run "bs spec/behavesLike.js"
    Then it should exit with code 0
    And the output should be:
      """
      User
        () => new User('bob')
          behaves like a user
            user => user.name
              ✔ it => it.equals('bob')
      Admin
        () => new Admin('bob')
          behaves like a user
            user => user.name
              ✔ it => it.equals('bob')

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
      () => 42
        the meaning of life
          fourty three minus one
            ✔ it => it.equals(43 - 1)

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
      () => 42
        the meaning of life
          ✖ it => it.isPending(assertion)

      1 failed

      () => 42
        the meaning of life
          ✖ it => it.isPending(assertion)
      Pending: the meaning of life
      """
