'use strict'

// TODO: Move this to ./server/lib

const _ = require('lodash')

const equipment = require('./equipment')

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

const carry = {
  lightMax: function(data) {
    const str = data.stats.str
    return Math.round( str * 2.5 + Math.pow(1.25, str))
  },
  mediumMax: function(data) {
    return carry.lightMax(data) * 2.0
  },
  heavyMax: function(data) {
    return Math.round((carry.lightMax(data) * 3.0) / 10) * 10
  },
}


const getCharacterById = function( id ) {
  // TODO: Extend this into a real controller
  return getCharacterDataById(id).then(function(data) {

    return Promise.all([
      equipment.createControllersForItems(data.equipment),
      races.getByName(data.race),
    ]).then( function(values) {

      const items = values[0]

      return {
        id: data.id,
        name: data.name,
        equipment: items,
        carryWeight: _.sumBy(items, 'weight'),
        lightMax: carry.lightMax(data, data.race),
        mediumMax: carry.mediumMax(data),
        heavyMax: carry.heavyMax(data),
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
