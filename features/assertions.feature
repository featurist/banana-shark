Feature: Assertions

  Scenario: it.equals(value)
    Given the file "spec/equals.js" contains:
      """
      module.exports = describe =>

        describe(
          () => 1,
          it => it.equals(1),
          it => it.equals(2)
        )

      """
    When I run "bs spec/equals.js"
    Then it should exit with code 1
    And the output should be:
      """
      () => 1
        ✔ it => it.equals(1)
        ✖ it => it.equals(2)

      1 passed, 1 failed

      () => 1
        ✖ it => it.equals(2)
      AssertionError: Expected values to be strictly equal:

      1 !== 2

          at Assertion.<anonymous> (spec/equals.js:6:14)
      """

  Scenario: it.deeplyEquals(value)
    Given the file "spec/deeplyEquals.js" contains:
      """
      module.exports = describe =>

        describe(
          () => ({ x: 1 }),
          it => it.deeplyEquals({ x: 1 }),
          it => it.deeplyEquals({ x: 2 }),
          it => it.deeplyEquals({ x: 1, y: 1 }),
          it => it.deeplyEquals({ x: '1' })
        )

      """
    When I run "bs spec/deeplyEquals.js"
    Then it should exit with code 1
    And the output should be:
      """
      () => ({ x: 1 })
        ✔ it => it.deeplyEquals({ x: 1 })
        ✖ it => it.deeplyEquals({ x: 2 })
        ✖ it => it.deeplyEquals({ x: 1, y: 1 })
        ✖ it => it.deeplyEquals({ x: '1' })

      1 passed, 3 failed

      () => ({ x: 1 })
        ✖ it => it.deeplyEquals({ x: 2 })
      AssertionError: Expected values to be strictly deep-equal:
      + actual - expected

        {
      +   x: 1
      -   x: 2
        }
          at it.deeplyEquals.x (spec/deeplyEquals.js:6:14)

      () => ({ x: 1 })
        ✖ it => it.deeplyEquals({ x: 1, y: 1 })
      AssertionError: Expected values to be strictly deep-equal:
      + actual - expected

        {
          x: 1,
      -   y: 1
        }
          at it.deeplyEquals.x (spec/deeplyEquals.js:7:14)

      () => ({ x: 1 })
        ✖ it => it.deeplyEquals({ x: '1' })
      AssertionError: Expected values to be strictly deep-equal:
      + actual - expected

        {
      +   x: 1
      -   x: '1'
        }
          at Assertion.<anonymous> (spec/deeplyEquals.js:8:14)
      """

  Scenario: it.isGreaterThan(other)
    Given the file "spec/isGreaterThan.js" contains:
      """
      module.exports = describe =>

        describe(
          () => 123,
          it => it.isGreaterThan(122),
          it => it.isGreaterThan(123)
        )

      """
    When I run "bs spec/isGreaterThan.js"
    Then it should exit with code 1
    And the output should be:
      """
      () => 123
        ✔ it => it.isGreaterThan(122)
        ✖ it => it.isGreaterThan(123)

      1 passed, 1 failed

      () => 123
        ✖ it => it.isGreaterThan(123)
      AssertionError: 123 > 123
          at Assertion.<anonymous> (spec/isGreaterThan.js:6:14)
      """

  Scenario: it.isLessThan(other)
    Given the file "spec/isLessThan.js" contains:
      """
      module.exports = describe =>

        describe(
          () => 123,
          it => it.isLessThan(124),
          it => it.isLessThan(123)
        )

      """
    When I run "bs spec/isLessThan.js"
    Then it should exit with code 1
    And the output should be:
      """
      () => 123
        ✔ it => it.isLessThan(124)
        ✖ it => it.isLessThan(123)

      1 passed, 1 failed

      () => 123
        ✖ it => it.isLessThan(123)
      AssertionError: 123 < 123
          at Assertion.<anonymous> (spec/isLessThan.js:6:14)
      """

  Scenario: it.isPending(reason)
    Given the file "spec/isPending.js" contains:
      """
      module.exports = describe =>

        describe(
          () => 123,
          it => it.isPending(),
          it => it.isPending('reason')
        )

      """
    When I run "bs spec/isPending.js"
    Then it should exit with code 1
    And the output should be:
      """
      () => 123
        ✖ it => it.isPending()
        ✖ it => it.isPending('reason')

      2 failed

      () => 123
        ✖ it => it.isPending()
      Pending: assertion pending

      () => 123
        ✖ it => it.isPending('reason')
      Pending: reason
      """

  Scenario: it.has(property)
    Given the file "spec/hasProperty.js" contains:
      """
      module.exports = describe =>

        describe(
          () => ({ foo: 1 }),
          it => it.has('foo'),
          it => it.has('bar')
        )

      """
    When I run "bs spec/hasProperty.js"
    Then it should exit with code 1
    And the output should be:
      """
      () => ({ foo: 1 })
        ✔ it => it.has('foo')
        ✖ it => it.has('bar')

      1 passed, 1 failed

      () => ({ foo: 1 })
        ✖ it => it.has('bar')
      AssertionError: Expected property 'bar'
          at Assertion.<anonymous> (spec/hasProperty.js:6:14)
      """

  Scenario: it.has(property).that
    Given the file "spec/hasPropertyThat.js" contains:
      """
      module.exports = describe =>

        describe(
          () => ({ foo: 1 }),
          it => it.has('foo').that.equals(1),
          it => it.has('foo').that.isGreaterThan(1)
        )

      """
    When I run "bs spec/hasPropertyThat.js"
    Then it should exit with code 1
    And the output should be:
      """
      () => ({ foo: 1 })
        ✔ it => it.has('foo').that.equals(1)
        ✖ it => it.has('foo').that.isGreaterThan(1)

      1 passed, 1 failed

      () => ({ foo: 1 })
        ✖ it => it.has('foo').that.isGreaterThan(1)
      AssertionError: 1 > 1
          at Assertion.<anonymous> (spec/hasPropertyThat.js:6:30)
      """

  Scenario: it.throws()
    Given the file "spec/itThrows.js" contains:
      """
      module.exports = describe =>

        describe(
          () => () => { throw new TypeError('oops') },
          it => it.throws(),
          it => it.throws(TypeError),
          it => it.throws(TypeError, 'oops'),
          it => it.throws(TypeError, 'daisy'),
          it => it.throws(Error),
          it => it.throws(Error, 'oops'),
          it => it.throws(Error, 'daisy'),
          it => it.throws(ReferenceError)
        )

      """
    When I run "bs spec/itThrows.js"
    Then it should exit with code 1
    And the output should be:
      """
      () => () => { throw new TypeError('oops') }
        ✔ it => it.throws()
        ✔ it => it.throws(TypeError)
        ✔ it => it.throws(TypeError, 'oops')
        ✖ it => it.throws(TypeError, 'daisy')
        ✔ it => it.throws(Error)
        ✔ it => it.throws(Error, 'oops')
        ✖ it => it.throws(Error, 'daisy')
        ✖ it => it.throws(ReferenceError)

      5 passed, 3 failed

      () => () => { throw new TypeError('oops') }
        ✖ it => it.throws(TypeError, 'daisy')
      AssertionError: Expected values to be strictly equal:
      + actual - expected

      + 'oops'
      - 'daisy'
          at Assertion.<anonymous> (spec/itThrows.js:8:14)

      () => () => { throw new TypeError('oops') }
        ✖ it => it.throws(Error, 'daisy')
      AssertionError: Expected values to be strictly equal:
      + actual - expected

      + 'oops'
      - 'daisy'
          at Assertion.<anonymous> (spec/itThrows.js:11:14)

      () => () => { throw new TypeError('oops') }
        ✖ it => it.throws(ReferenceError)
      AssertionError: Expected ReferenceError, but TypeError was thrown
          at Assertion.<anonymous> (spec/itThrows.js:12:14)
      """
