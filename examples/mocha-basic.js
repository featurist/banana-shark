// https://mochajs.org/#synchronous-code

module.exports = describe => {

  describe('Array',
    describe('#indexOf()',
      describe(
        'should return -1 when the value is not present',
        () => [1, 2, 3].indexOf(4),
        it => it.equals(-1)
      )
    )
  )

}
