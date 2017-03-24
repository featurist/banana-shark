Feature: After

  Scenario: Running specs with after blocks
    Given the file "spec/after.js" contains:
      """
      module.exports = describe => {

        describe(
          () => [],
          describe.after(
            array => array.push(42),
            it => it.has('length').that.equals(1)
          )
        )

      }
      """
    When I run "bs spec/after.js"
    Then it should exit with code 0
    And the output should be:
      """
      () => []
        after: array => array.push(42)
          ✔ it => it.has('length').that.equals(1)

      1 passed
      """
