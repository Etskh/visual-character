'use strict'

var assert = require('assert')
var expect = require('expect')


describe('Effect', function() {

  var effect = require('../../../server/lib/util/effect')

  const effectData = {
    name: 'data.name',
    type: 'data.type',
    dismissible: 'data.dismissible',
    stats: 'data.stats',
  }

  it('creates an effect controller from data', function(done) {
    effect.createFromData(effectData).then( function(effectController) {
      done()
    })
  })
})
