'use strict'

const _ = require('lodash')
const request = require('request')
const url = require('url')
const csvParse = require('csv-parse')

const equipmentUrl = url.parse('https://docs.google.com/spreadsheets/d/1F6K60YeuSyXYIURuwweCLy1c3wtwIeo9S9mpECdztlc/pub?output=csv')

const equipmentData = new Promise(function(resolve, reject) {

  request(equipmentUrl.href, function (error, response, body) {
    if ( error ) {
      return reject(error)
    }

    var items = []
    csvParse(body, function(error, lines){
      var titles = lines[0]
      for ( var i=1; i<lines.length; ++i ) {
        var item = {}
        for ( var f=0; f<titles.length; ++f ) {
          item[titles[f]] = lines[i][f]
        }
        items.push(item)
      }

      return resolve(items)
    })
  })
})

const getAllEquipmentData = function() {
  return equipmentData
}

const getEquipmentDataByName = function( name ) {
  return new Promise(function( resolve, reject ) {
    getAllEquipmentData().then(function(equipmentData) {
      const item = _.find(equipmentData, { 'name': name })
      if ( !item ) {
        return reject('Unknown item named ' + name )
      }
      resolve(item)
    })
  })
}

const createEquipmentController = function( item ) {
  return getEquipmentDataByName(item.equipment).then(function(equipment) {
    return ({
      id: item.id,
      name: [
        _.includes(item.properties, 'masterwork') ? '+1' : '',
        item.material ? item.material : '',
        equipment.name,
      ].join(' ').trim(),
      weight: Math.round(equipment.weight * item.count * 100) / 100,
      count: item.count,
    })
  })
}


const createControllersForItems = function(items) {
  const controllers = []
  _.forEach(items, function(item) {
    controllers.push( createEquipmentController( item ))
  })
  return Promise.all(controllers)
}


module.exports.equipmentUrl = equipmentUrl
module.exports.createControllersForItems = createControllersForItems
module.exports.createEquipmentController = createEquipmentController
module.exports.getEquipmentDataByName = getEquipmentDataByName
module.exports.getAllEquipmentData = getAllEquipmentData
