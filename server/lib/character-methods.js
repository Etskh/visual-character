'use strict'

const _ = require('lodash')


const dropItem = function(character, id) {
  _.remove(character.data.equipment, {'id': parseInt(id) })
  return character.save()
}

const addItem = function(character, name) {

  // Add the item to a new stack in the data.equipment list

  // TODO: Find an existing stack in the character's inventory and increment the stack
  
  return character.save()
}


module.exports.add = function( characterController ) {
  characterController.dropItem = function(id) {
    return dropItem(characterController, id)
  }

  characterController.addItem = function(name) {
    return addItem(characterController, name)
  }
}
