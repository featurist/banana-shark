Feature: Aspects

  Scenario: Running specs with aspects
    Given the file "spec/aspect.js" contains:
      """
      module.exports = describe => {

        describe('User',
          () => new User('bob'),
          'is named bob'
        )

        describe('Admin',
          () => new Admin('bob'),
          'is named bob'
        )

        describe.aspect(
          'is named bob',
          describe(
            user => user.name,
            it => it.equals('bob')
          )
        )
      }

      function User(name) { this.name = name }
      var Admin = User
      """
    When I run "bs spec/aspect.js"
    Then it should exit with code 0
    And the output should be:
      """
      User
        () => new User('bob')
          is named bob
            user => user.name
              ✔ it => it.equals('bob')
      Admin
        () => new Admin('bob')
          is named bob
            user => user.name
              ✔ it => it.equals('bob')

      2 passed
      """

  Scenario: Specs with aspects that refer to other aspects
    Given the file "spec/aspectAspect.js" contains:
      """
      module.exports = describe => {

        describe(
          () => 42,
          'the meaning of life'
        )

        describe.aspect(
          'the meaning of life',
          'fourty three minus one'
        )

        describe.aspect(
          'fourty three minus one',
          it => it.equals(43 - 1)
        )

      }
      """
    When I run "bs spec/aspectAspect.js"
    Then it should exit with code 0
    And the output should be:
      """
      () => 42
        the meaning of life
          fourty three minus one
            ✔ it => it.equals(43 - 1)

      1 passed
      """

  Scenario: Pending aspects
    Given the file "spec/pendingAspect.js" contains:
      """
      module.exports = describe => {

        describe(
          () => 42,
          'is even'
        )

      }
      """
    When I run "bs spec/pendingAspect.js"
    Then it should exit with code 1
    And the output should be:
      """
      () => 42
        is even
          ✖ it => it.isPending(aspect)

      1 failed

      () => 42
        is even
          ✖ it => it.isPending(aspect)
      Pending aspect: is even
      """

  Scenario: Trying to create an aspect with no name
    Given the file "spec/anonymousAspect.js" contains:
      """
      module.exports = describe => {

        describe.aspect(() => 666)

      }
      """
    When I run "bs spec/anonymousAspect.js"
    Then it should exit with code 1
    And the output should be:
      """
      Error: Aspect name is required
          at module.exports.describe (spec/anonymousAspect.js:3:12)
      """

  Scenario: Trying to create an aspect with a zero-argument function
    Given the file "spec/zeroArgumentAspect.js" contains:
      """
      module.exports = describe => {

        describe.aspect('bad aspect', () => 666)

      }
      """
    When I run "bs spec/zeroArgumentAspect.js"
    Then it should exit with code 1
    And the output should be:
      """
      Error: Aspects take assertions (you passed a factory: () => 666)
          at module.exports.describe (spec/zeroArgumentAspect.js:3:12)
      """
