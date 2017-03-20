module.exports = describe => {

  describe(
    'an empty array',
    () => [],
    'an empty stack',
    describe('after pushing undefined',
      stack => { stack.push(undefined); return stack },
      'a stack with a single undefined item'
    ),
    describe('after pushing 66',
      stack => { stack.push(66); return stack },
      'a stack where the only pushed item was 66'
    )
  )

  describe(
    'an array with a single undefined item',
    () => [undefined],
    'a stack with a single undefined item',
    describe('after pushing 66',
      stack => { stack.push(66); return stack },
      'a stack where the last pushed item was 66'
    )
  )

  describe('a stack with a single undefined item',
    'can push an item',
    'a stack with one item',
    'pops undefined'
  )

  describe('an empty stack',
    'can push an item',
    'returns undefined when popped',
    describe('has length 1', it => it.has('length').that.equals(1))
  )

  describe('can push an item',
    describe('when pushing the item',
      stack => stack.push(77),
      it => it.isGreaterThan(0)
    ),
    describe('after pushing 66',
      stack => { stack.push(66); return stack },
      'a stack where the last pushed item was 66'
    )
  )

  describe('returns undefined when popped',
    stack => stack.pop(),
    it => it.equals(undefined)
  )

  describe('a stack with one item',
    describe('has length 1', it => it.has('length').that.equals(1)),
    describe('after calling .pop()',
      stack => { stack.pop(); return stack },
      'an empty stack'
    )
  )

  describe('a stack where the only pushed item was 66',
    'behaves like a stack with one item',
    'can push an item',
    'a stack where the last pushed item was 66',
    describe('has length 1', it => it.has('length').that.equals(1))
  )

  describe('a stack where the last pushed item was 66',
    describe('has length > 0', it => it.has('length').that.isGreaterThan(0)),
    describe('when calling .pop()',
      stack => stack.pop(),
      popped => popped.equals(66)
    )
  )

}
