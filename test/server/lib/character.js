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

  it('returns the error if it can\'t read the file', function(done) {

    const errorMessage = 'This is an error';
    sinon.stub(fs, "readFile", function( dataPath, callback ) {
      return callback(errorMessage)
    })

    character.getById(1).then( function(character) {
      assert(false)
      done()
    }, function(error) {
      expect(error).toEqual(errorMessage)
      fs.readFile.restore()
      done()
    })
  })

  it('returns the error if it can\'t read the file', function(done) {

    const errorMessage = 'This is an error';
    sinon.stub(JSON, "parse", function( contents ) {
      throw new Error(errorMessage)
    })

    character.getById(1).then( function(character) {
      assert(false)
      done()
    }, function(error) {
      JSON.parse.restore()
      done()
    })
  })


  it('returns the error if it can\'t read the file', function(done) {
    character.getById(999999999).then( function(character) {
      assert(false)
      done()
    }, function(error) {
      expect(error).toExist()
      done()
    })
  })
})
