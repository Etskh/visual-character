'use strict'

const _ = require('lodash')

// TODO: Move this to ./server/lib

const raceData = require('../data/races')

const size = require('../util/size')

const getRaceByName = function( name ) {
  const data = _.find(raceData, { 'name': name.toLowerCase() })
  if ( !data ) {
    return reject('Unknown race: ' + name )
  }
  return size.getByName(data.size).then(function(size) {
    return {
      'name': data.name,
      'size': size,
    }
  })
}

module.exports.getByName = getRaceByName