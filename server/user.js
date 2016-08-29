'use strict'

// TODO: Put in the user-model
const users = [{
  'username': 'user',
  'password': 'pass',
}]

const characters = [{
  'name': 'Pig',
  'race': 'Goblin',
  'classes': {
    'Wizard': 4
  },
  'handedness': 'right',
  'held': [ // an array where 0 is main and 1 is right, etc.
    // empty hands
  ],
  'items': [],
  'possessions': [],
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



const createController = function(data) {
  return {
    name: data.username,
    checkPassword: function(password) {
      // TODO: TODO: make this a promise
      // TODO: Make this a salted hash
      if( password === data.password) {
        return true
      }
      return false
    },
    // TODO: replace this with an array of character controllers
    getCharacters: function() {
      return new Promise(function(resolve, reject) {
        return resolve(characters) // resolve
      }) // new promise
    }, // getCharacters
  }
}



const authenticate = function( username, password ) {
  console.log('Authenticating ' + username + '...')
  return new Promise(function( resolve, reject ) {
    return getByName(username).then(function(user){
      console.log('Checking password for ' + username )
      if ( user.checkPassword(password) ) {
        console.log('User ' + user.name + ' logging in')
        return resolve( user )
      }
      reject('Incorrect password')
    })
  })
}

const getByName = function( username ) {
  console.log('Retriveing ' + username + ' from records')
  return new Promise(function(resolve, reject) {
    for( let i in users ) {
      if ( users[i].username === username ) {
        let user = createController(users[i])
        return resolve( user )
      }
    }
    reject('Unknown user ' + username )
  })
}



module.exports.authenticate = authenticate
module.exports.getByName = getByName
module.exports.createController = createController
