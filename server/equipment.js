'use strict'

const _ = require('lodash')


const equipment = [{
  'name': 'dagger',
  'weight': 1.0,
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
        'slashing'
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
      'type': 'piercing'
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


const createController = function( prototype, item ) {

  const isMasterwork = (item.properties.indexOf('masterwork') !== -1)

  return {
    name: [
      isMasterwork ? '+1' : '',
      item.material ? item.material : '',
      item.prototype,
    ].join(' '),
  }
}


const getByName = function(name) {
  return new Promise(function( resolve, reject ) {
    const item = _.find(equipment, { 'name': name })
    if ( !item ) {
      return reject('Unknown item named ' + name )
    }
    resolve(item)
  })
}

const createControllersForItems = function(equipment) {
  return new Promise( function( resolve, reject ) {
    const controllers = []
    _(equipment).forEach(function(e) {
      controllers.push( createController( getByName(e.prototype), e ))
    })
    return resolve(controllers)
  })
}

module.exports.createControllersForItems = createControllersForItems
