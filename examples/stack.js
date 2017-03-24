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
