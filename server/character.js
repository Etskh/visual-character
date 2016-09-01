'use strict'

// TODO: Move this to ./server/lib

const _ = require('lodash')

const equipment = require('./equipment')

// TODO: Put in the character model
const characterData = [{
  'id': 1,
  'name': 'Pig',
  'race': 'Goblin',
  'classes': {
    'Wizard': 4
  },
  'skill_ranks': {
    'linguistics': 3,
    'spellcraft': 4,
    'knowledge': {
      'arcana': 4,
    },
  },
  // Which is the dominant hand
  'handedness': 'right',
  // an array where 0 is main and 1 is right, etc.
  'slots': {
    // nothing equipped or held!
  },
  'equipment': [{
    'equipment': 'dagger',
    'count': 1,
    'material': 'silver',
    'properties': [
      'masterwork',
    ],
  }, {
    'equipment': 'dagger',
    'count': 2,
  }],
  'height': 2.9,
  'weight': 40.0,
  'stats': {
    'str': 9,
    'dex': 17,
    'con': 12,
    'int': 18,
    'wis': 13,
    'cha': 9
  },
  'enchantments': [{
    'name': 'Wisdom drain',
    'since': 50,
    'duration': 20,
    'effects': {
      'stats.wisdom': -3,
    },
  }], // enchantments
}, {
  'id': 2,
  'name': 'Kazrah',
  'race': 'Half-orc',
  'classes': {
    'Ranger': 4
  },
  'skill_ranks': {
  },
  // Which is the dominant hand
  'handedness': 'right',
  // an array where 0 is main and 1 is right, etc.
  'slots': {
    // nothing equipped or held!
  },
  'equipment': [],
  'height': 6.2,
  'weight': 210.0,
  'stats': {
    'str': 16,
    'dex': 15,
    'con': 12,
    'int': 10,
    'wis': 14,
    'cha': 12
  },
  'enchantments': [],
}]


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
    return equipment.createControllersForItems(
      data.equipment
    ).then(function(items) {

      return {
        id: data.id,
        name: data.name,
        equipment: items,
        carryWeight: _.sumBy(items, 'weight'),
        lightMax: carry.lightMax(data),
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
