# banana-shark

A JavaScript unit test runner designed to be:

* strictly synchronous
* declarative
* fast
* global-free

## Declaring Tests

banana-shark tests are expressed as JavaScript modules that export a single
function with one `describe` parameter:

```js
module.exports = describe => {

  describe(
    'one hundred and twenty three',  // name (optional)
    () => 123,                       // factory
    it => it.equals(123)             // assertion
  )

}
```

`describe` takes an optional name as its first argument, followed by a factory
function that creates a _subject_, followed by any number of assertions against
the subject, or nested describe blocks.

`it` is used to express assertions about the subject

The assertion should throw an error when it fails. If it uses any asynchronous
code, then it will also fail. There are ways round this. Don't use them.
Any factory or mutation using asynchronous code is also considered to fail.

## Assertions

`it` provides assertions:

* `it.equals(expectedValue)`
* `it.deeplyEquals(expectedValue)`
* `it.isGreaterThan(expectedValue)`
* `it.isLessThan(expectedValue)`
* `it.has(propertyName)`
* `it.has(propertyName).that.equals(expectedValue)`
* `it.has(propertyName).that.deeplyEquals(expectedValue)`
* `it.throws()`
* `it.throws(expectedErrorType)`
* `it.throws(expectedErrorType, expectedErrorMessage)`

## Nested Contexts

Nested `describe` blocks take a _mutating_ factory as their first argument,
which is passed the outer block's subject, for example:

```js
describe(
  () => 1,                // factory
  it => it.equals(1),     // assertion
  describe(
    x  => x + 2,          // mutation
    it => it.equals(3),   // assertion
    describe(
      y  => y + 3,        // mutation
      it => it.equals(6)  // assertion
    )
  )
)
```

## Sharing assertions with aspects

`aspects` are _abstract_ specs, in the sense that they have no factories, but
only consist of assertions. Aspects allow specs to be composed of reusable
blocks, for example:

```js
describe(
  () => new Man(),
  it => it.has('legs')
)

describe(
  () => new Dog(),
  it => it.has('legs')
)
```

...can be reduced to:

```js
describe(
  () => new Man(),
  'is legged'
)

describe(
  () => new Dog(),
  'is legged'
)

describe.aspect(
  'is legged',
  it => it.has('legs')
)
```

## Complete Example

```js
module.exports = describe => {

  describe(
    () => [],
    'is like an empty stack',
    describe(
      'pushing an item',
      stack => stack.push('whatever'),
      it => it.equals(1)
    ),
    describe(
      'after pushing undefined',
      stack => { stack.push(undefined); return stack },
      'is like a stack with a single undefined item'
    ),
    describe(
      'after pushing 66',
      stack => { stack.push(66); return stack },
      'is like a stack with only 66'
    )
  )

  describe(
    () => [undefined],
    'is like a stack with a single undefined item',
    describe(
      'after pushing 66',
      stack => { stack.push(66); return stack },
      'is like a stack whose last pushed item was 66'
    )
  )

  describe.aspect(
    'is like a stack with a single undefined item',
    'can push an item',
    'is like a stack with one item',
    'returns undefined when popped'
  )

  describe.aspect(
    'is like an empty stack',
    'can push an item',
    'returns undefined when popped',
    'has no items'
  )

  describe.aspect(
    'can push an item',
    describe(
      'the result of pushing an item',
      stack => stack.push(-1),
      it => it.isGreaterThan(0)
    ),
    describe(
      'after pushing 66',
      stack => { stack.push(66); return stack },
      'is like a stack whose last pushed item was 66'
    )
  )

  describe.aspect(
    'returns undefined when popped',
    describe(
      stack => stack.pop(),
      it => it.equals(undefined)
    )
  )

  describe.aspect(
    'is like a stack with one item',
    'has one item',
    describe(
      'after popping an item',
      stack => { stack.pop(); return stack },
      'is like an empty stack'
    ),
    describe(
      'pushing another item',
      stack => stack.push(11),
      it => it.equals(2)
    ),
    describe(
      'after pushing another item',
      stack => { stack.push(77); return stack },
      it => it.has('length').that.equals(2)
    )
  )

  describe.aspect(
    'is like a stack with only 66',
    'is like a stack with one item',
    'can push an item',
    'is like a stack whose last pushed item was 66',
    'has one item'
  )

  describe.aspect(
    'is like a stack whose last pushed item was 66',
    'has more than zero items',
    describe(
      stack => stack.pop(),
      it => it.equals(66)
    )
  )

  describe.aspect(
    'has no items',
    it => it.has('length').that.equals(0)
  )

  describe.aspect(
    'has one item',
    it => it.has('length').that.equals(1)
  )

  describe.aspect(
    'has more than zero items',
    it => it.has('length').that.isGreaterThan(0)
  )

}
```

Running `bs` against this spec generates the following output:

```
() => []
  is like an empty stack
    can push an item
      the result of pushing an item
        stack => stack.push(-1)
          ✔ it => it.isGreaterThan(0)
      after pushing 66
        stack => { stack.push(66); return stack }
          is like a stack whose last pushed item was 66
            has more than zero items
              ✔ it => it.has('length').that.isGreaterThan(0)
            stack => stack.pop()
              ✔ it => it.equals(66)
    returns undefined when popped
      stack => stack.pop()
        ✔ it => it.equals(undefined)
    has no items
      ✔ it => it.has('length').that.equals(0)
  pushing an item
    stack => stack.push('whatever')
      ✔ it => it.equals(1)
  after pushing undefined
    stack => { stack.push(undefined); return stack }
      is like a stack with a single undefined item
        can push an item
          the result of pushing an item
            stack => stack.push(-1)
              ✔ it => it.isGreaterThan(0)
          after pushing 66
            stack => { stack.push(66); return stack }
              is like a stack whose last pushed item was 66
                has more than zero items
                  ✔ it => it.has('length').that.isGreaterThan(0)
                stack => stack.pop()
                  ✔ it => it.equals(66)
        is like a stack with one item
          has one item
            ✔ it => it.has('length').that.equals(1)
          after popping an item
            stack => { stack.pop(); return stack }
              is like an empty stack
                can push an item
                  the result of pushing an item
                    stack => stack.push(-1)
                      ✔ it => it.isGreaterThan(0)
                  after pushing 66
                    stack => { stack.push(66); return stack }
                      is like a stack whose last pushed item was 66
                        has more than zero items
                          ✔ it => it.has('length').that.isGreaterThan(0)
                        stack => stack.pop()
                          ✔ it => it.equals(66)
                returns undefined when popped
                  stack => stack.pop()
                    ✔ it => it.equals(undefined)
                has no items
                  ✔ it => it.has('length').that.equals(0)
          pushing another item
            stack => stack.push(11)
              ✔ it => it.equals(2)
          after pushing another item
            stack => { stack.push(77); return stack }
              ✔ it => it.has('length').that.equals(2)
        returns undefined when popped
          stack => stack.pop()
            ✔ it => it.equals(undefined)
  after pushing 66
    stack => { stack.push(66); return stack }
      is like a stack with only 66
        is like a stack with one item
          has one item
            ✔ it => it.has('length').that.equals(1)
          after popping an item
            stack => { stack.pop(); return stack }
              is like an empty stack
                can push an item
                  the result of pushing an item
                    stack => stack.push(-1)
                      ✔ it => it.isGreaterThan(0)
                  after pushing 66
                    stack => { stack.push(66); return stack }
                      is like a stack whose last pushed item was 66
                        has more than zero items
                          ✔ it => it.has('length').that.isGreaterThan(0)
                        stack => stack.pop()
                          ✔ it => it.equals(66)
                returns undefined when popped
                  stack => stack.pop()
                    ✔ it => it.equals(undefined)
                has no items
                  ✔ it => it.has('length').that.equals(0)
          pushing another item
            stack => stack.push(11)
              ✔ it => it.equals(2)
          after pushing another item
            stack => { stack.push(77); return stack }
              ✔ it => it.has('length').that.equals(2)
        can push an item
          the result of pushing an item
            stack => stack.push(-1)
              ✔ it => it.isGreaterThan(0)
          after pushing 66
            stack => { stack.push(66); return stack }
              is like a stack whose last pushed item was 66
                has more than zero items
                  ✔ it => it.has('length').that.isGreaterThan(0)
                stack => stack.pop()
                  ✔ it => it.equals(66)
        is like a stack whose last pushed item was 66
          has more than zero items
            ✔ it => it.has('length').that.isGreaterThan(0)
          stack => stack.pop()
            ✔ it => it.equals(66)
        has one item
          ✔ it => it.has('length').that.equals(1)
() => [undefined]
  is like a stack with a single undefined item
    can push an item
      the result of pushing an item
        stack => stack.push(-1)
          ✔ it => it.isGreaterThan(0)
      after pushing 66
        stack => { stack.push(66); return stack }
          is like a stack whose last pushed item was 66
            has more than zero items
              ✔ it => it.has('length').that.isGreaterThan(0)
            stack => stack.pop()
              ✔ it => it.equals(66)
    is like a stack with one item
      has one item
        ✔ it => it.has('length').that.equals(1)
      after popping an item
        stack => { stack.pop(); return stack }
          is like an empty stack
            can push an item
              the result of pushing an item
                stack => stack.push(-1)
                  ✔ it => it.isGreaterThan(0)
              after pushing 66
                stack => { stack.push(66); return stack }
                  is like a stack whose last pushed item was 66
                    has more than zero items
                      ✔ it => it.has('length').that.isGreaterThan(0)
                    stack => stack.pop()
                      ✔ it => it.equals(66)
            returns undefined when popped
              stack => stack.pop()
                ✔ it => it.equals(undefined)
            has no items
              ✔ it => it.has('length').that.equals(0)
      pushing another item
        stack => stack.push(11)
          ✔ it => it.equals(2)
      after pushing another item
        stack => { stack.push(77); return stack }
          ✔ it => it.has('length').that.equals(2)
    returns undefined when popped
      stack => stack.pop()
        ✔ it => it.equals(undefined)
  after pushing 66
    stack => { stack.push(66); return stack }
      is like a stack whose last pushed item was 66
        has more than zero items
          ✔ it => it.has('length').that.isGreaterThan(0)
        stack => stack.pop()
          ✔ it => it.equals(66)

46 passed
```

## Design

### Strictly Synchronous

Asynchronous tests are difficult to express and reason about and have the
inherent potential to run slowly and non-deterministically. Synchronous tests
take control of time, so they are guaranteed to be deterministic and are
generally faster and easier to reason about. In other words, synchronous tests
are cheaper to create and maintain than asynchronous tests.

Just because your code is asynchronous it doesn't mean your tests have to be.
You just need to avoid depending on global implementations of asynchronous
constructs, and use synchronous equivalents in tests.

### No Nested Functions

Unlike other testing tools that support nested contexts, `describe` blocks in
banana-shark are not expressed as functions themselves. In other words,
`describe` takes the result of `describe` as an argument. This subtle
difference means tests are less likely to access shared state and can therefore
be executed concurrently.

## Mocha like-for-like example

```js
// mocha
var assert = require('assert');
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    })
  })
})

// banana-shark
describe('Array',
  describe('#indexOf()',
    describe(
      'should return -1 when the value is not present',
      () => [1,2,3].indexOf(4),
      it => it.equals(-1)
    )
  )
)
```

More mocha like-for-like examples can be found under [examples](./examples)
