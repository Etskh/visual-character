'use strict'

var assert = require('assert')
var expect = require('expect')


describe('Effect', function() {

  var effect = require('../../../server/lib/util/effect')

  const effectData = [{
    name: 'name',
    type: 'type',
    dismissible: false,
    stats: 'data.stats',
  }, {
    name: 'name2',
    type: 'type',
    dismissible: false,
    stats: 'data2.stats',
  }]

  it('creates effect controllers from data', function(done) {
    const effects = [
      effect.createFromData(effectData[0]),
      effect.createFromData(effectData[1]),
    ]
    done()
  })
})
