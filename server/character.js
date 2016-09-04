'use strict'

// TODO: Move this to ./server/lib

const _ = require('lodash')

const equipment = require('./equipment')
const race = require('./race')
const effect = require('./effect')
const stat = require('./stat')
const carry = require('./util/carry')

const characterData = require('./data/characters')


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
      const stats = {}

      const carryWeight = _.sumBy(items, 'weight')
      const currentLoad = carry.getLoadName(carryWeight, data, race.size)

      // If the current load isn't a light load
      if ( currentLoad !== 'light') {
        statusEffects.push(effect.createFromData(carry.effects[currentLoad]))
      }


      // Now create the primary stats
      _.forEach( data.stats, function(base, name) {
        stats[name] = stat.createFromData({
          name: name,
          base_value: base,
        }, statusEffects)
      })


      return {
        // Basic data
        id: data.id,
        name: data.name,
        race: race,

        // Stats
        stats: stats,
        mods: function(stat) {
          const mod = Math.floor((stat / 2) - 5)
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
