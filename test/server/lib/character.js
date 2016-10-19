'use strict'

var assert = require('assert')
var expect = require('expect')


describe('Character', function() {

  var character = require('../../../server/lib/character')

  it('gets a character from data', function(done) {
    character.getById(1).then( function(character) {
      done()
    })
  })
})
