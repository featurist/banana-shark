module.exports = describe => {

  describe(
    () => [],
    'an empty stack',
    describe('after pushing undefined',
      stack => { stack.push(undefined); return stack },
      'with a single undefined item'
    ),
    describe('after pushing 66',
      stack => { stack.push(66); return stack },
      'only pushed item was 66'
    )
  )

  describe(
    () => [undefined],
    'with a single undefined item',
    describe('after pushing 66',
      stack => { stack.push(66); return stack },
      'last pushed item was 66'
    )
  )

  describe(
    'with a single undefined item',
    'can push an item',
    'with one item',
    'returns undefined when popped'
  )

  describe(
    'an empty stack',
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
      'last pushed item was 66'
    )
  )

  describe(
    'returns undefined when popped',
    stack => stack.pop(),
    it => it.equals(undefined)
  )

  describe(
    'with one item',
    'has length 1',
    describe(
      'after calling .pop()',
      stack => { stack.pop(); return stack },
      'an empty stack'
    )
  )

  describe(
    'only pushed item was 66',
    'with one item',
    'can push an item',
    'last pushed item was 66',
    'has length 1'
  )

  describe('last pushed item was 66',
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
