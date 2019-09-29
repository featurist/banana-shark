/* eslint-env mocha */

const assert = require('assert')
const Broadcaster = require('../lib/broadcaster')

describe('Broadcaster', function () {
  [
    'suiteStarted',
    'specStarted',
    'descriptionStarted',
    'assertionStarted',
    'assertionPassed',
    'descriptionEnded',
    'specEnded',
    'suiteEnded',
    'unexpectedError'
  ].forEach(function (event) {
    it('forwards ' + event + ' and 1 argument to all listeners', function () {
      function listen () { this.events.push([].slice.apply(arguments)) }
      const listener1 = { events: [], [event]: listen }
      const listener2 = { events: [], [event]: listen }
      const broadcaster = new Broadcaster([listener1, listener2])
      broadcaster[event](123)
      broadcaster[event](456, 789)
      assert.deepStrictEqual(listener1.events, [[123], [456]])
    })
  });

  [
    'assertionFailed'
  ].forEach(function (event) {
    it('forwards ' + event + ' and 2 arguments to all listeners', function () {
      function listen () { this.events.push([].slice.apply(arguments)) }
      const listener1 = { events: [], [event]: listen }
      const listener2 = { events: [], [event]: listen }
      const broadcaster = new Broadcaster([listener1, listener2])
      broadcaster[event](123)
      broadcaster[event](456, 789)
      assert.deepStrictEqual(listener1.events, [[123, undefined], [456, 789]])
    })
  })
})
