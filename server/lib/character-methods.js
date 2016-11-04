'use strict'

const _ = require('lodash')

const dropItem = function(character, id, count) {
  const removedItems = _.remove(character.data.equipment, {'id': parseInt(id) })

  // Subtract that count from the item
  // If there are more than 0 left, then re-add it to the array
  removedItems[0].count -= count
  if( removedItems[0].count > 0 ) {
    character.data.equipment.push(removedItems[0])
  }
  return character.save()
}

const addItem = function(character, itemTitle, count ) {

  const heighestIdItem = _.maxBy(character.data.equipment, function(o){
    return parseInt(o.id)
  })

  // Create the item data for the player
  const item = {
    // get the highest id and augment!
    'id': parseInt(heighestIdItem.id) + 1,
    'equipment': itemTitle,
    'count': count,
  }

  character.data.equipment.push(item)

  return character.save()
}

const getWealthAsItems = function( character, wealth ) {

  let copper = _.find(character.equipment, {title: 'copper-piece'})
  console.log(copper)

}

const buyItem = function( character, itemTitle, cost ) {

  // subtract cost gold from inventory
  // get as many copper pieces as we can

  getWealthAsItems(character, 100)

  return true

  // add item to inventory
  //return character.addItem(name)
}


module.exports.add = function( characterController ) {
  characterController.dropItem = function(id, count) {
    return dropItem(characterController, id, count)
  }

  characterController.addItem = function(itemTitle, count) {
    return addItem(characterController, itemTitle, count)
  }

  characterController.buyItem = function(itemTitle, cost) {
    return addItem(characterController, itemTitle, cost)
  }
}
