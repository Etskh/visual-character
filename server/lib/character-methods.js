'use strict'

const _ = require('lodash')


const dropItem = function(character, id) {
  console.log('Dropping item')
  _.remove(character.data.equipment, {'id': parseInt(id) })
  console.log('Saving character')
  return character.save()
}


module.exports.add = function( characterController ) {
  characterController.dropItem = function(id) {
    return dropItem(characterController, id)
  }
}
