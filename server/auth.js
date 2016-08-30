'use strict'

const characterController = require('./character')

// TODO: Put in the user-model
const users = [{
  'username': 'user',
  'password': 'pass',
  'characters': [
    1
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
    // TODO: replace this with an array of character controllers
    getCharacters: function() {
      return new Promise(function(resolve, reject) {
        return resolve(characterController.getByIds(data.characters))
      }) // new promise
    }, // getCharacters
    hasPermissionToCharacter: function(id) {
      return new Promise(function(resolve, reject) {
        for( let i in data.characters ) {
          const character = characterController.getById(data.characters[i])
          if ( character ) {
            return resolve(character)
          }
          return reject('Character with id ' + id + ' doesnt exist')
        }
        reject('User doesnt have permission to characer ' + id )
      })
    }, // hasPermissionToCharacter
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
