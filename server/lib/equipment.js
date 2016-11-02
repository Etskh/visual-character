'use strict'

const _ = require('lodash')
const request = require('request')
const url = require('url')
const csvParse = require('csv-parse')

const cost = require('./util/cost')

const equipmentUrl = url.parse('https://docs.google.com/spreadsheets/d/1F6K60YeuSyXYIURuwweCLy1c3wtwIeo9S9mpECdztlc/pub?output=csv')

String.prototype.toTitleCase = function() {
  const words = this.split(' ')
  const heading = []
  for ( let w = 0; w < words.length; ++w ) {
    heading.push(
      words[w].slice(0, 1).toUpperCase() +
      words[w].substring(1)
    )
  }
  return heading.join(' ')
}


const equipmentData = new Promise(function(resolve, reject) {

  request(equipmentUrl.href, function (error, response, body) {
    if ( error ) {
      return reject(error)
    }

    var items = []
    csvParse(body, function(error, lines){
      var titles = lines[0]
      for ( var i=1; i<lines.length; ++i ) {
        var item = {}
        for ( var f=0; f<titles.length; ++f ) {
          item[titles[f]] = lines[i][f]
        }

        // Add a title object to each
        item.title = item.name.split(' ').join('-')
        item.converted_cost = cost.toSmallestDenomination(item.cost)
        item.heading = item.name.toTitleCase()
        items.push(item)
      }

      return resolve(items)
    })
  })
})

const getAllEquipmentData = function() {
  return equipmentData
}

const getAllEquipmentTypes = function () {
  return new Promise( function( resolve ) {
    return resolve([{
      name: 'weapon',
    },{
      name: 'armour',
    },{
      name: 'magic',
    },{
      name: 'container',
    },{
      name: 'exploration',
    },{
      name: 'wealth',
    }])
  })
}

const getEquipmentDataByName = function( name ) {
  return new Promise(function( resolve, reject ) {
    getAllEquipmentData().then(function(equipmentData) {
      const item = _.find(equipmentData, { 'name': name })
      if ( !item ) {
        return reject('Unknown item named ' + name )
      }
      resolve(item)
    })
  })
}


const getEquipmentDataByTitle = function( title ) {
  return new Promise(function( resolve, reject ) {
    getAllEquipmentData().then(function(equipmentData) {
      const item = _.find(equipmentData, { 'title': title })
      if ( !item ) {
        return reject('Unknown item with title ' + title )
      }
      resolve(item)
    })
  })
}

const getEquipmentByCategory = function ( category ) {
  return new Promise(function( resolve, reject ) {
    getAllEquipmentData().then(function(equipmentData) {
      resolve(_.filter(equipmentData, { 'type': category }))
    })
  })
}


const createEquipmentController = function( item ) {
  return getEquipmentDataByName(item.equipment).then(function(equipment) {
    return ({
      id: item.id,
      title: equipment.title,
      heading: equipment.heading,
      description: equipment.description,
      name: [
        _.includes(item.properties, 'masterwork') ? '+1' : '',
        item.material ? item.material : '',
        equipment.name,
      ].join(' ').trim(),
      weight: Math.round(equipment.weight * item.count * 100) / 100,
      count: item.count,
      converted_cost: equipment.converted_cost,
    })
  })
}


const createControllersForItems = function(items) {
  const controllers = []
  _.forEach(items, function(item) {
    controllers.push( createEquipmentController( item ))
  })
  return Promise.all(controllers)
}



module.exports.equipmentUrl = equipmentUrl
module.exports.createControllersForItems = createControllersForItems
module.exports.createEquipmentController = createEquipmentController
module.exports.getEquipmentDataByName = getEquipmentDataByName
module.exports.getEquipmentDataByTitle = getEquipmentDataByTitle
module.exports.getAllEquipmentData = getAllEquipmentData
module.exports.getAllTypes = getAllEquipmentTypes
module.exports.getByCategory = getEquipmentByCategory
