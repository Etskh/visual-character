'use strict'

var assert = require('assert')
var expect = require('expect')


describe('Race', function() {

  var race = require('../../../server/lib/race')

  it('returns an race controller by name', function(done) {
    race.getByName('goblin').then( function(race) {
      done()
    })
  })
  it('rejects the promise if it isnt a race', function(done) {
    race.getByName('ThisIsNotARace').then( function(race) {
      // empty
    }, function(err) {
      done()
    })
  })
})
