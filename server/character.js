'use strict'

// TODO: Move this to ./server/lib

const _ = require('lodash')

const equipment = require('./equipment')
const race = require('./race')

const characterData = require('./data/characters')


const carry = {
  getLoadName: function(load, data, size) {
    if( load < carry.lightMax(data, size) ) {
      return 'light'
    }
    if( load < carry.mediumMax(data, size) ) {
      return 'medium'
    }
    if( load < carry.heavyMax(data, size) ) {
      return 'heavy'
    }

    return 'staggering'
  },
  lightMax: function(data, sizeController) {
    const str = data.stats.str
    return Math.round((
        str * 2.5 +
        Math.pow(1.25, str)
      ) * sizeController.carrycap_multiplier
    )
  },
  mediumMax: function(data, sizeController) {
    return carry.lightMax(data, sizeController) * 2.0
  },
  heavyMax: function(data, sizeController) {
    return Math.round((
      carry.lightMax(data, sizeController) * 3.0
    ) / 10) * 10
  },
  /*reduceSpeed: function(movespeed, load_data) {
    const speeds = [

    ]
  },
  effects: {
    'light_load': {
      'max_dex': null,
      'check_penalty': 0,
      'speed': 0,
      'run_multiplier': 4,
    },
    'medium_load': {
      'max_dex': 3,
      'check_penalty': -3,
      'speed': 'reduced 1',
      'run_multiplier': 4,
    },
    'heavy_load': {
      'max_dex': 1,
      'check_penalty': -6,
      'speed': 'reduced 1',
      'run_multiplier': 3,
    },
    'staggering_load': {
      'max_dex': 0,
      'check_penalty': -10,
      'speed': 5,
      'run_multiplier': 0,
    }
  }*/
}




const getCharacterDataById = function( id ) {
  return new Promise(function( resolve, reject ) {
    const character = _.find(characterData, { 'id': parseInt(id) })
    if ( !character ) {
      return reject('Unknown character with id ' + id )
    }
    resolve(character)
  })
}


const getCharacterById = function( id ) {
  // TODO: Extend this into a real controller
  return getCharacterDataById(id).then(function(data) {

    return Promise.all([
      equipment.createControllersForItems(data.equipment),
      race.getByName(data.race),
    ]).then( function(values) {

      const items = values[0]
      const race = values[1]

      const carryWeight = _.sumBy(items, 'weight')

      return {
        // Basic data
        id: data.id,
        name: data.name,
        race: race,

        // Stats
        stats: data.stats,
        mods: function(stat) {
          return Math.floor((data.stats[stat] / 2) - 5)
        },
        status_effects: [],

        // Equipment
        equipment: items,
        carry_weight: carryWeight,
        current_load: carry.getLoadName(carryWeight, data, race.size),
        light_max: carry.lightMax(data, race.size),
        medium_max: carry.mediumMax(data, race.size),
        heavy_max: carry.heavyMax(data, race.size),
      }
    })
  })
}


const getCharacterByIds = function(ids) {
  var shortList = []

  _.forEach(ids, function(id) {
    shortList.push(getCharacterById(id))
  })

  return Promise.all(shortList)
}

module.exports.getById = getCharacterById
module.exports.getByIds = getCharacterByIds
