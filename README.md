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
    it => it.equals(123),                        // assertion
    it => it("is less than 200", n => n < 200)   // assertion
  )

}
```

`describe` takes an optional name as its first argument, followed by a mandatory
factory function, followed by any number of either assertions that operate on
the result of the factory function, or nested describe blocks.

`it` takes the name of an assertion, followed by a predicate that is passed
the result of the factory function:

```js
describe(
  () => new Duck(),
  it => it('quacks', duck => assert.equals('quack!', duck.saySomething()))
)
```

The predicate is considered to fail when it:

* returns `false`
* returns an instance of `Error`
* throws
* Uses asynchronous code e.g. `setTimeout`, `process.nextTick` and `Promise`

Any factory or mutation using asynchronous code is also considered to fail.

## Assertions

`it` provides access to a number of convenience methods to generate
commonly-used assertions:

* `it.equals(expectedValue)`
* `it.deeplyEquals(expectedValue)`
* `it.returns(expectedResult, action)`
* `it.throws(expectedError)`
* `it.doesNotThrow()`
* `it.hasProperty(name, expectedValue)`

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

  describe(() => [], it => it("behaves like a stack"))

  describe("behaves like a stack",

    describe("after being created",
      it => it("behaves like an empty stack")
    ),

    describe("after an item is pushed", stack => stack.push(66),
      it => it("has length", 1),
      it => it("can push an item"),
      it => it("allows the pushed item to be popped", it.returns(66, stack => stack.pop())),
      describe("then an item is popped",
        it => it("behaves like an empty stack")
      )
    )
  )

  describe("behaves like an empty stack",
    it => it("has length", 0),
    it => it("can push an item"),
    it => it("cannot pop an item")
  )

  describe("has length", (it, expected) => it.hasProperty('length', expected))
  describe("can push an item", it => it.doesNotThrow(stack => stack.push(42)))
  describe("cannot pop an item", it => it.throws(stack => stack.pop()))

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

## No nested function scopes

Unlike other testing tools that support nested contexts, `describe` blocks in
banana-shark are not expressed as functions themselves. In other words,
`describe` takes the result of `describe` as an argument. This subtle
difference means tests can be executed in parallel.
