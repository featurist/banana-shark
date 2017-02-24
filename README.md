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
    'one hundred and twenty three',              // name (optional)
    () => 123,                                   // factory
    it => it.equals(123),                   // assertion
    it => it("is less than 200", n => n < 200)   // assertion
  )

}
```

`describe` takes an optional name as its first argument, followed by a mandatory
factory function, followed by any number of either assertions that operate on
the result of the factory function, or nested describe blocks.

`it` takes the name of an assertion, followed by a function that is passed
the result of the factory or mutation:

```js
describe(
  () => new Duck(),
  it => it('quacks', duck => assert.equals('quack!', duck.saySomething()))
)
```

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

Nested `describe` blocks take a _mutation_ instead of a factory as their first
argument, which is passed the result of the outer block's factory or mutation,
for example:

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

## Example

```js
module.exports = describe => {

  describe(
    'an empty array',
    () => [],
    it => it('behaves like an empty stack'),
    describe('after pushing undefined',
      stack => { stack.push(undefined); return stack },
      it => it('behaves like a stack with a single undefined item')
    ),
    describe('after pushing 66',
      stack => { stack.push(66); return stack },
      it => it('behaves like a stack where the only pushed item was 66')
    )
  )

  describe(
    'an array with a single undefined item',
    () => [undefined],
    it('behaves like a stack with a single undefined item'),
    describe('after pushing 66',
      stack => { stack.push(66); return stack },
      it => it('behaves like a stack where the last pushed item was 66')
    )
  )

  describe('behaves like a stack with a single undefined item',
    it => it('can push an item'),
    it => it('behaves like a stack with one item'),
    it => it('pops undefined')
  )

  describe('behaves like an empty stack',
    it => it('can push an item'),
    it => it('returns undefined when popped'),
    describe('has length 1', it => it.has('length').that.equals(1))
  )

  describe('can push an item',
    describe('when pushing the item',
      stack => stack.push(77),
      it => it.isGreaterThan(0)
    ),
    describe('after pushing 66',
      stack => { stack.push(66); return stack },
      it => it('behaves like a stack where the last pushed item was 66')
    )
  )

  describe('returns undefined when popped',
    stack => stack.pop(),
    it => it.equals(undefined)
  )

  describe('behaves like a stack with one item',
    describe('has length 1', it => it.has('length').that.equals(1)),
    describe('after calling .pop()',
      stack => { stack.pop(); return stack },
      it => it('behaves like an empty stack')
    )
  )

  describe('behaves like a stack where the only pushed item was 66',
    it => it('behaves like a stack with one item'),
    it => it('can push an item'),
    it => it('behaves like a stack where the last pushed item was 66'),
    describe('has length 1', it => it.has('length').that.equals(1))
  )

  describe('behaves like a stack where the last pushed item was 66',
    describe('has length > 0', it => it.has('length').that.isGreaterThan(0)),
    describe('when calling .pop()',
      stack => stack.pop(),
      popped => popped.equals(66)
    )
  )

}
```

## Design

## Strictly Synchronous Tests

Asynchronous tests are difficult to express and reason about and have the
inherent potential to run slowly and non-deterministically. Synchronous tests
take control of time, so they are guaranteed to be deterministic and are
generally faster and easier to reason about. In other words, synchronous tests
are cheaper to create and maintain than asynchronous tests.

Just because your code is asynchronous it doesn't mean your tests have to be.
You just need to avoid depending on global implementations of asynchronous
constructs, and use synchronous equivalents in tests. For example:

```js
class Dog {
  constructor(setTimeout) {
    this.setTimeout = setTimeout
  }

  saySomething: function(listener) {
    this.setTimeout(() => listener.hear("woof!"), 1000)
  }
}

const immediateTimeout = callback => callback()

describe(() => new Dog(immediateTimeout),  
  describe("eventually .saySomething() says", dog => {
    let said
    dog.saySomething({ hear: sound => said = sound })
    return said
  },
  it => it.equals("woof!"))
})
```

## No Nested Function Scopes

Unlike other testing tools that support nested contexts, `describe` blocks in
banana-shark are not expressed as functions themselves. In other words,
`describe` takes the result of `describe` as an argument. This subtle
difference means tests are less likely to access shared state and can therefore
be executed concurrently.

## Reusable contexts

`behaves like` is a key concept in banana-shark, allowing specs to be composed
of reusable blocks that build on previous blocks. This is effectively like
a quick way of defining custom assertions that only apply in a specific scope:

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
  it => it('is legged')
)

describe(
  () => new Woman(),
  it => it('is legged')
)

describe('is legged', it => it.has('legs'))
```
