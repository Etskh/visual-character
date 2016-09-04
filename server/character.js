'use strict'

// TODO: Move this to ./server/lib

const _ = require('lodash')

const equipment = require('./equipment')
const race = require('./race')
const effect = require('./effect')

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
  effects: {
    medium: {
      name: 'Medium Load',
      type: 'encumbrance',
      dismissible: false,
      stats: {
        'check_penalty': -3,
        'max_dex': 3,
      }
    },
    heavy: {
      name: 'Heavy Load',
      type: 'encumbrance',
      dismissible: false,
      effects: {
        'check_penalty': -6,
        'max_dex': 1,
      }
    },
    staggering: {
      name: 'Staggering Load',
      type: 'encumbrance',
      dismissible: false,
      effects: {
        'check_penalty': -10,
        'max_dex': 0,
      }
    }
  }
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

      const statusEffects = []

      const carryWeight = _.sumBy(items, 'weight')
      const currentLoad = carry.getLoadName(carryWeight, data, race.size)

      if ( currentLoad === 'medium' ) {
        statusEffects.push(effect.createFromData(carry.effects.medium))
      }

      return {
        // Basic data
        id: data.id,
        name: data.name,
        race: race,

        // Stats
        stats: data.stats,
        mods: function(stat) {
          const mod = Math.floor((data.stats[stat] / 2) - 5)
          return (mod > 0 ? '+' : '') + mod
        },
        status_effects: statusEffects,

        // Equipment
        equipment: items,
        carry_weight: carryWeight,
        current_load: currentLoad,
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
