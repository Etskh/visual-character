'use strict'

var assert = require('assert')
var expect = require('expect')


describe('Equipment', function() {

  var equip = require('../../server/lib/equipment')

  let itemList = [{
    'equipment': 'dagger',
    'count': 1
  }]

  describe('All functions will good data will return', function() {
    it('returns an equipment data by name', function(done) {
      equip.getEquipmentDataByName('dagger').then( function(equipment) {
        done()
      })
    })

    it('returns an equipment controller with an item', function(done) {
      equip.createEquipmentController(
        itemList[0]
      ).then( function( equipment ) {
        done()
      })
    })

    it('returns a list of equipment controllers', function(done) {
      equip.createControllersForItems( itemList )
      .then( function( items ) {
        done()
      })

    })
  })
})
