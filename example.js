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
