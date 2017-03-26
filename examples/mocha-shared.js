// https://github.com/mochajs/mocha/wiki/Shared-Behaviours

module.exports = describe => {

  describe('User',
    () => new User('tobi', 'holowaychuk'),
    'behaves like a user'
  )

  describe('Admin',
    () => new Admin('tobi', 'holowaychuk'),
    'behaves like a user',
    describe('should be an .admin',
      user => user.admin,
      it => it.equals(true)
    )
  )

  describe.aspect('behaves like a user',

    describe(
      user => user.name.first,
      it => it.equals('tobi')
    ),

    describe(
      user => user.name.last,
      it => it.equals('holowaychuk')
    ),

    describe(
      user => user.fullname(),
      it => it.equals('tobi holowaychuk')
    )
  )

}

function User (first, last) {
  this.name = {
    first: first,
    last: last
  }
}

User.prototype.fullname = function () {
  return this.name.first + ' ' + this.name.last
}

function Admin (first, last) {
  User.call(this, first, last)
  this.admin = true
}

/* eslint no-proto: "off" */
Admin.prototype.__proto__ = User.prototype
