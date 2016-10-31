'use strict'


const getLoadName = function(load, data, size) {
  if( load < lightMax(data, size) ) {
    return 'light'
  }
  if( load < mediumMax(data, size) ) {
    return 'medium'
  }
  if( load < heavyMax(data, size) ) {
    return 'heavy'
  }

  return 'staggering'
}


const lightMax = function(data, sizeController) {
  const str = data.stats.str
  return Math.round((
      str * 2.5 +
      Math.pow(1.25, str)
    ) * sizeController.carrycap_multiplier
  )
}

const mediumMax = function(data, sizeController) {
  return lightMax(data, sizeController) * 2.0
}

const heavyMax = function(data, sizeController) {
  return Math.round((
    lightMax(data, sizeController) * 3.0
  ) / 10) * 10
}

module.exports.getLoadName = getLoadName

module.exports.lightMax = lightMax
module.exports.mediumMax = mediumMax
module.exports.heavyMax = heavyMax

module.exports.effects = {
  medium: {
    name: 'Medium Load',
    type: 'encumbrance',
    dismissible: false,
    stats: {
      'check_penalty': -3,
      'max_dex': 17,
    }
  },
  heavy: {
    name: 'Heavy Load',
    type: 'encumbrance',
    dismissible: false,
    stats: {
      'check_penalty': -6,
      'max_dex': 13,
    }
  },
  staggering: {
    name: 'Staggering Load',
    type: 'encumbrance',
    dismissible: false,
    stats: {
      'check_penalty': -10,
      'max_dex': 11,
    }
  }
}
