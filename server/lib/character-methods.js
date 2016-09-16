'use strict'

const _ = require('lodash')
const equipment = require('./equipment')

const dropItem = function(character, id) {
  _.remove(character.data.equipment, {'id': parseInt(id) })
  return character.save()
}

const addItem = function(character, name) {

  const heighestIdItem = _.maxBy(character.data.equipment, function(o){
    return parseInt(o.id)
  });

  // Create the item data for the player
  const item = {
    // get the highest id and augment!
    'id': parseInt(heighestIdItem.id) + 1,
    'equipment': name,
    'count': 1,
  }

  character.data.equipment.push(item)

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
