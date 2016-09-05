'use strict'

const _ = require('lodash')

// TODO: Move this to ./server/lib

const equipmentData = require('../data/equipment')

const getEquipmentDataByName = function( name ) {
  return new Promise(function( resolve, reject ) {
    const item = _.find(equipmentData, { 'name': name })
    if ( !item ) {
      return reject('Unknown item named ' + name )
    }
    resolve(item)
  })
}

const createEquipmentController = function( item ) {
  return getEquipmentDataByName(item.equipment).then(function(equipment) {
    return ({
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


module.exports.createControllersForItems = createControllersForItems
module.exports.createEquipmentController = createEquipmentController
module.exports.getEquipmentDataByName = getEquipmentDataByName
