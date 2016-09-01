'use strict'

const _ = require('lodash')

// TODO: Move this to ./server/lib

const equipmentData = [{
  'name': 'dagger',
  'weight': 1.1,
  'cost': 200,
  'handedness': 'light',
  'type': 'weapon',
  'sub_type': 'simple',
  'attacks': [{
    'damage': {
      'die': 4,
      'count': 1,
      'type': [
        'piercing',
        'slashing',
      ],
    },
    'range': false,
    'critical': {
      'range': 2,
      'multiplier': 2,
    },
  },{
    'damage': {
      'die': 4,
      'count': 1,
      'type': 'piercing',
    },
    'range': {
      'type': 'thrown',
      'increment': 10,
    },
    'critical': {
      'range': 2,
      'multiplier': 2,
    },
  }],
}]

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
      weight: equipment.weight * item.count,
      getAttacks: function() {
        return equipment.attacks
      }
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
