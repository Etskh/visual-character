'use strict'

const fs = require('fs')
const assert = require('assert')
const expect = require('expect')
const nock = require('nock')


describe('Equipment', function() {

  const equip = require('../../../server/lib/equipment')

  let itemList = [{
    'equipment': 'dagger',
    'count': 1
  }]

  // nock the request from the google drive
  console.log(equip.equipmentUrl.protocol + '//' + equip.equipmentUrl.host)
  nock(equip.equipmentUrl.protocol + '//' + equip.equipmentUrl.host)
    .get(equip.equipmentUrl.path)
    .reply( 200, fs.readFileSync('test/fixtures/equipment.csv'))

  // 
  describe('All functions will good data will return', function() {
    it('returns an equipment data by name', function(done) {
      equip.getEquipmentDataByName('dagger').then( function(equipment) {
        done()
      })
    })

    it('doesnt return an item if not given a good thing', function(done) {
      equip.getEquipmentDataByName(
        'def-not-an-item'
      ).then( function(equipment) {
        // empty
      }, function(error) {
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
