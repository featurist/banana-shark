module.exports = describe => {

  describe(() => [], it => it('behaves like a stack'))

  describe('behaves like a stack',

    describe('after being created',
      it => it('behaves like an empty stack')
    ),

    describe('after an item is pushed', stack => stack.push(66),
      it => it('has length', 1),
      it => it('can push an item'),
      it => it('allows the pushed item to be popped', it.returns(66, stack => stack.pop())),
      describe('then an item is popped',
        it => it('behaves like an empty stack')
      )
    )
  )

  describe('behaves like an empty stack',
    it => it('has length', 0),
    it => it('can push an item'),
    it => it('cannot pop an item')
  )

  describe('has length', (it, expected) => it.hasProperty('length', expected))
  describe('can push an item', it => it.doesNotThrow(stack => stack.push(42)))
  describe('cannot pop an item', it => it.throws(stack => stack.pop()))

}
