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
    describe('pushing an item',
      stack => stack.push('whatever'),
      it => it.equals(1)
    ),
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
    'has no items'
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
    'has one item',
    describe(
      'after popping an item',
      stack => { stack.pop(); return stack },
      'is like an empty stack'
    ),
    describe('pushing another item',
      stack => stack.push(11),
      it => it.equals(2)
    ),
    describe('after pushing another item',
      stack => { stack.push(77); return stack },
      it => it.has('length').that.equals(2)
    )
  )

  describe(
    'is like a stack with only 66',
    'is like a stack with one item',
    'can push an item',
    'is like a stack whose last pushed item was 66',
    'has one item'
  )

  describe(
    'is like a stack whose last pushed item was 66',
    describe(
      'has more than zero items',
      stack => stack,
      it => it.has('length').that.isGreaterThan(0)
    ),
    describe(
      stack => stack.pop(),
      it => it.equals(66)
    )
  )

  describe(
    'has no items',
    stack => stack,
    it => it.has('length').that.equals(0)
  )

  describe(
    'has one item',
    stack => stack,
    it => it.has('length').that.equals(1)
  )

}
```

Running `bs` against this spec generates the following output:

```
✔ () => [], is like an empty stack, can push an item, stack => stack.push(77), it => it.isGreaterThan(0)
✔ () => [], is like an empty stack, can push an item, after pushing 66, is like a stack whose last pushed item was 66, has more than zero items, it => it.has('length').that.isGreaterThan(0)
✔ () => [], is like an empty stack, can push an item, after pushing 66, is like a stack whose last pushed item was 66, stack => stack.pop(), it => it.equals(66)
✔ () => [], is like an empty stack, returns undefined when popped, it => it.equals(undefined)
✔ () => [], is like an empty stack, has no items, it => it.has('length').that.equals(0)
✔ () => [], pushing an item, it => it.equals(1)
✔ () => [], after pushing undefined, is like a stack with a single undefined item, can push an item, stack => stack.push(77), it => it.isGreaterThan(0)
✔ () => [], after pushing undefined, is like a stack with a single undefined item, can push an item, after pushing 66, is like a stack whose last pushed item was 66, has more than zero items, it => it.has('length').that.isGreaterThan(0)
✔ () => [], after pushing undefined, is like a stack with a single undefined item, can push an item, after pushing 66, is like a stack whose last pushed item was 66, stack => stack.pop(), it => it.equals(66)
✔ () => [], after pushing undefined, is like a stack with a single undefined item, is like a stack with one item, has one item, it => it.has('length').that.equals(1)
✔ () => [], after pushing undefined, is like a stack with a single undefined item, is like a stack with one item, after popping an item, is like an empty stack, can push an item, stack => stack.push(77), it => it.isGreaterThan(0)
✔ () => [], after pushing undefined, is like a stack with a single undefined item, is like a stack with one item, after popping an item, is like an empty stack, can push an item, after pushing 66, is like a stack whose last pushed item was 66, has more than zero items, it => it.has('length').that.isGreaterThan(0)
✔ () => [], after pushing undefined, is like a stack with a single undefined item, is like a stack with one item, after popping an item, is like an empty stack, can push an item, after pushing 66, is like a stack whose last pushed item was 66, stack => stack.pop(), it => it.equals(66)
✔ () => [], after pushing undefined, is like a stack with a single undefined item, is like a stack with one item, after popping an item, is like an empty stack, returns undefined when popped, it => it.equals(undefined)
✔ () => [], after pushing undefined, is like a stack with a single undefined item, is like a stack with one item, after popping an item, is like an empty stack, has no items, it => it.has('length').that.equals(0)
✔ () => [], after pushing undefined, is like a stack with a single undefined item, is like a stack with one item, pushing another item, it => it.equals(2)
✔ () => [], after pushing undefined, is like a stack with a single undefined item, is like a stack with one item, after pushing another item, it => it.has('length').that.equals(2)
✔ () => [], after pushing undefined, is like a stack with a single undefined item, returns undefined when popped, it => it.equals(undefined)
✔ () => [], after pushing 66, is like a stack with only 66, is like a stack with one item, has one item, it => it.has('length').that.equals(1)
✔ () => [], after pushing 66, is like a stack with only 66, is like a stack with one item, after popping an item, is like an empty stack, can push an item, stack => stack.push(77), it => it.isGreaterThan(0)
✔ () => [], after pushing 66, is like a stack with only 66, is like a stack with one item, after popping an item, is like an empty stack, can push an item, after pushing 66, is like a stack whose last pushed item was 66, has more than zero items, it => it.has('length').that.isGreaterThan(0)
✔ () => [], after pushing 66, is like a stack with only 66, is like a stack with one item, after popping an item, is like an empty stack, can push an item, after pushing 66, is like a stack whose last pushed item was 66, stack => stack.pop(), it => it.equals(66)
✔ () => [], after pushing 66, is like a stack with only 66, is like a stack with one item, after popping an item, is like an empty stack, returns undefined when popped, it => it.equals(undefined)
✔ () => [], after pushing 66, is like a stack with only 66, is like a stack with one item, after popping an item, is like an empty stack, has no items, it => it.has('length').that.equals(0)
✔ () => [], after pushing 66, is like a stack with only 66, is like a stack with one item, pushing another item, it => it.equals(2)
✔ () => [], after pushing 66, is like a stack with only 66, is like a stack with one item, after pushing another item, it => it.has('length').that.equals(2)
✔ () => [], after pushing 66, is like a stack with only 66, can push an item, stack => stack.push(77), it => it.isGreaterThan(0)
✔ () => [], after pushing 66, is like a stack with only 66, can push an item, after pushing 66, is like a stack whose last pushed item was 66, has more than zero items, it => it.has('length').that.isGreaterThan(0)
✔ () => [], after pushing 66, is like a stack with only 66, can push an item, after pushing 66, is like a stack whose last pushed item was 66, stack => stack.pop(), it => it.equals(66)
✔ () => [], after pushing 66, is like a stack with only 66, is like a stack whose last pushed item was 66, has more than zero items, it => it.has('length').that.isGreaterThan(0)
✔ () => [], after pushing 66, is like a stack with only 66, is like a stack whose last pushed item was 66, stack => stack.pop(), it => it.equals(66)
✔ () => [], after pushing 66, is like a stack with only 66, has one item, it => it.has('length').that.equals(1)
✔ () => [undefined], is like a stack with a single undefined item, can push an item, stack => stack.push(77), it => it.isGreaterThan(0)
✔ () => [undefined], is like a stack with a single undefined item, can push an item, after pushing 66, is like a stack whose last pushed item was 66, has more than zero items, it => it.has('length').that.isGreaterThan(0)
✔ () => [undefined], is like a stack with a single undefined item, can push an item, after pushing 66, is like a stack whose last pushed item was 66, stack => stack.pop(), it => it.equals(66)
✔ () => [undefined], is like a stack with a single undefined item, is like a stack with one item, has one item, it => it.has('length').that.equals(1)
✔ () => [undefined], is like a stack with a single undefined item, is like a stack with one item, after popping an item, is like an empty stack, can push an item, stack => stack.push(77), it => it.isGreaterThan(0)
✔ () => [undefined], is like a stack with a single undefined item, is like a stack with one item, after popping an item, is like an empty stack, can push an item, after pushing 66, is like a stack whose last pushed item was 66, has more than zero items, it => it.has('length').that.isGreaterThan(0)
✔ () => [undefined], is like a stack with a single undefined item, is like a stack with one item, after popping an item, is like an empty stack, can push an item, after pushing 66, is like a stack whose last pushed item was 66, stack => stack.pop(), it => it.equals(66)
✔ () => [undefined], is like a stack with a single undefined item, is like a stack with one item, after popping an item, is like an empty stack, returns undefined when popped, it => it.equals(undefined)
✔ () => [undefined], is like a stack with a single undefined item, is like a stack with one item, after popping an item, is like an empty stack, has no items, it => it.has('length').that.equals(0)
✔ () => [undefined], is like a stack with a single undefined item, is like a stack with one item, pushing another item, it => it.equals(2)
✔ () => [undefined], is like a stack with a single undefined item, is like a stack with one item, after pushing another item, it => it.has('length').that.equals(2)
✔ () => [undefined], is like a stack with a single undefined item, returns undefined when popped, it => it.equals(undefined)
✔ () => [undefined], after pushing 66, is like a stack whose last pushed item was 66, has more than zero items, it => it.has('length').that.isGreaterThan(0)
✔ () => [undefined], after pushing 66, is like a stack whose last pushed item was 66, stack => stack.pop(), it => it.equals(66)

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
