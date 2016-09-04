'use strict'


const createEffectFromData = function( data, character ) {
  return {
    name: data.name,
    type: data.type,
    dismissible: data.dismissible,
  }
}

module.exports.createFromData = createEffectFromData
