'use strict'

const _ = require('lodash')

const dropItem = function(character, id) {
  _.remove(character.data.equipment, {'id': parseInt(id) })
  return character.save()
}

const addItem = function(character, itemTitle, count=1) {

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
  characterController.dropItem = function(id) {
    return dropItem(characterController, id)
  }

  characterController.addItem = function(itemTitle) {
    return addItem(characterController, itemTitle)
  }

  characterController.buyItem = function(itemTitle, cost) {
    return addItem(characterController, itemTitle, cost)
  }
}
