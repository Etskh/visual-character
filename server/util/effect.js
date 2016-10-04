'use strict'


const createEffectFromData = function( data ) {
  return new Promise( function(resolve ) {
    return resolve({
      name: data.name,
      type: data.type,
      dismissible: data.dismissible,
      stats: data.stats,
    })
  })
}

module.exports.createFromData = createEffectFromData
