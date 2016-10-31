'use strict'

const _ = require('lodash')

const sizes = [{
  'name': 'fine',
  'ac_bonus': 4,
  'stealth_bonus': 16,
  'carrycap_multiplier': 0.125,
},{
  'name': 'diminutive',
  'ac_bonus': 3,
  'stealth_bonus': 12,
  'carrycap_multiplier': 0.25,
},{
  'name': 'tiny',
  'ac_bonus': 2,
  'stealth_bonus': 8,
  'carrycap_multiplier': 0.5,
}, {
  'name': 'small',
  'ac_bonus': 1,
  'stealth_bonus': 4,
  'carrycap_multiplier': 0.75,
}, {
  'name': 'medium',
  'ac_bonus': 0,
  'stealth_bonus': 0,
  'carrycap_multiplier': 1.0,
}, {
  'name': 'large',
  'ac_bonus': -1,
  'stealth_bonus': -4,
  'carrycap_multiplier': 2.0,
}, {
  'name': 'huge',
  'ac_bonus': -2,
  'stealth_bonus': -8,
  'carrycap_multiplier': 4.0,
}, {
  'name': 'gargantuan',
  'ac_bonus': -3,
  'stealth_bonus': -12,
  'carrycap_multiplier': 8.0,
}, {
  'name': 'colossal',
  'ac_bonus': -4,
  'stealth_bonus': -16,
  'carrycap_multiplier': 16.0,
}]



const getSizeByName = function( name ) {
  return new Promise(function( resolve, reject ) {
    const sizeData = _.find(sizes, { 'name': name })
    if ( !sizeData ) {
      return reject('Unknown size: ' + name )
    }
    resolve({
      name: sizeData.name,
      carrycap_multiplier: sizeData.carrycap_multiplier,
    })
  })
}

module.exports.getByName = getSizeByName
