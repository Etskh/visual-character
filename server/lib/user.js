'use strict'

const _ = require('lodash')

const characterController = require('./character')

// TODO: Move this to ./server/lib

// TODO: Put in the user-model
const users = [{
  'username': 'user',
  'password': 'pass',
  'active_character': null,
  'characters': [
    1, 2
  ],
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
    getCharacters: function() {
      return characterController.getByIds(data.characters)
    }, // getCharacters
    hasPermissionToCharacter: function(id) {
      return characterController.getById(id)
    }, // hasPermissionToCharacter
    saveActiveCharacter: function(id) {
      const user = _.find(users, {'username': data.username})
      user.active_character = id
    }, // saveActiveCharacter
    getActiveCharacter: function() {
      return characterController.getById(data.active_character)
    }, // getActiveCharacter
  }
}



const authenticate = function( username, password ) {
  return new Promise(function( resolve, reject ) {
    return getByName(username).then( function(user) {
      if ( user.checkPassword(password) ) {
        return resolve( user )
      }
      reject('Incorrect password')
    })
  })
}

const getByName = function( username ) {
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
