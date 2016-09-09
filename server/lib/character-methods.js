'use strict'

const _ = require('lodash')


const dropItem = function(character, id) {
  _.remove(character.data.equipment, {'id': parseInt(id) })
  return character.save()
}


module.exports.add = function( characterController ) {
  characterController.dropItem = function(id) {
    return dropItem(characterController, id)
  }
}
