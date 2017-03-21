# banana-shark

A JavaScript unit test runner designed to be:

* strictly synchronous
* declarative
* fast
* global-free

banana-shark does evil things like monkey-patching global `setTimeout` to avoid
any possibility of asynchronous behaviour.

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

`it` provides access to a number of convenience methods to generate
commonly-used assertions:

* `it.equals(expectedValue)`
* `it.deeplyEquals(expectedValue)`
* `it.throws([expectedError])`
* `it.doesNotThrow()`
* `it.has(propertyName)`
* `it.isGreaterThan(expectedValue)`
* `it.isLessThan(expectedValue)`
* `it.has(propertyName, expectedValue)`
* `it.has(propertyName).that.equals(expectedValue)`
* `it.has(propertyName).that.deeplyEquals(expectedValue)`

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

## Complete Example

```js
module.exports = describe => {

  describe(
    () => [],
    'is like an empty stack',
    describe('after pushing undefined',
      stack => { stack.push(undefined); return stack },
      'is like a stack with a single undefined item'
    ),
    describe('after pushing 66',
      stack => { stack.push(66); return stack },
      'is like a stack with only 66'
    )
  )

  describe(
    () => [undefined],
    'is like a stack with a single undefined item',
    describe('after pushing 66',
      stack => { stack.push(66); return stack },
      'is like a stack whose last pushed item was 66'
    )
  )

  describe(
    'is like a stack with a single undefined item',
    'can push an item',
    'is like a stack with one item',
    'returns undefined when popped'
  )

  describe(
    'is like an empty stack',
    'can push an item',
    'returns undefined when popped',
    'has length 0'
  )

  describe(
    'can push an item',
    describe(
      stack => stack.push(77),
      it => it.isGreaterThan(0)
    ),
    describe(
      'after pushing 66',
      stack => { stack.push(66); return stack },
      'is like a stack whose last pushed item was 66'
    )
  )

  describe(
    'returns undefined when popped',
    stack => stack.pop(),
    it => it.equals(undefined)
  )

  describe(
    'is like a stack with one item',
    'has length 1',
    describe(
      'after calling .pop()',
      stack => { stack.pop(); return stack },
      'is like an empty stack'
    )
  )

  describe(
    'is like a stack with only 66',
    'is like a stack with one item',
    'can push an item',
    'is like a stack whose last pushed item was 66',
    'has length 1'
  )

  describe(
    'is like a stack whose last pushed item was 66',
    describe(
      'has length > 0',
      stack => stack,
      it => it.has('length').that.isGreaterThan(0)
    ),
    describe(
      'when calling .pop()',
      stack => stack.pop(),
      it => it.equals(66)
    )
  )

  describe(
    'has length 0',
    stack => stack,
    it => it.has('length').that.equals(0)
  )

  describe(
    'has length 1',
    stack => stack,
    it => it.has('length').that.equals(1)
  )

}
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

### Reusable Contexts

`is like` is a key concept in banana-shark, allowing specs to be composed
of reusable blocks that build on previous blocks. This is effectively like
a quick way of defining custom assertions. For example:

```js
describe(
  () => new Man(),
  it => it.has('legs')
)

describe(
  () => new Woman(),
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
  () => new Woman(),
  'is legged'
)

describe(
  'is legged',
  it => it.has('legs')
)
```
