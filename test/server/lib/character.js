'use strict'

const assert = require('assert')
const expect = require('expect')
const sinon = require('sinon')
const fs = require('fs')

describe('Character', function() {

  const character = require('../../../server/lib/character')

  it('gets a character from data', function(done) {
    character.getById(1).then( function(character) {
      done()
    })
  })

  it('gets the character data', function(done) {
    character.getData().then(
      function(characterData) {
      done()
    })
  })

  it('gets the character data', function(done) {

    const getDataError = 'error'

    sinon.stub(character, "getData", function() {
      return new Promise(function(resolve, reject) {
        return reject(getDataError)
      })
    })

    character.getData()
    .then(function(characterData) {
      assert(false)
      done()
    }, function(error) {
      assert(getDataError).equals(error)
      done()
    })
  })

  
})
