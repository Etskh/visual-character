'use strict'

// TODO: Put in the character model
const characters = [{
  'id': 1,
  'name': 'Pig',
  'race': 'Goblin',
  'classes': {
    'Wizard': 4
  },
  'handedness': 'right',
  'held': [ // an array where 0 is main and 1 is right, etc.
    // empty hands
  ],
  'equipment': {
    'owned': [],
    'on_body': [],
    'equipped': {},
  },
  'height': 2.9,
  'weight': 40.0,
  'stats': [ 9, 17, 12, 18, 13, 9 ],
  'enchantments': [{
    'name': 'Wisdom drain',
    'since': 50,
    'duration': 20,
    'effects': {
      'stats.wisdom': -3,
    },
  }], // enchantments
}]

const getCharacterById = function(id) {
  for( let i in characters ) {
    if ( id === characters[i].id ) {
      return createController(characters[i])
    }
  }
  return false
}

const createController = function(data) {
  return {
    name: data.name,
  }
}

const getCharacterByIds = function(ids) {
  return new Promise( function(resolve, reject ) {
    var shortList = []
    for( let i in ids ) {
      shortList.push(getCharacterById(ids[i]))
    }
    resolve(shortList)
  })
}

module.exports.getById = getCharacterById
module.exports.getByIds = getCharacterByIds
