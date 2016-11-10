'use strict'

const _ = require('lodash')

const createStatFromData = function( data, statusEffects ) {

  const effects = []
  let lowest_max = null

  _.forEach( statusEffects, function(statusEffect) {

    const max = statusEffect.stats['max_' + data.name]
    if( max ) {
      // Set the lowest maximum value
      if ( !lowest_max || max < lowest_max ) {
        lowest_max = max
      }
      effects.push({
        'origin': statusEffect.name,
        'max': max,
      })
    }
  })

  const is_lowered = lowest_max ? (data.base_value > lowest_max) : false

  return {
    base: data.name,
    effects: effects,
    status: is_lowered ? 'lowered' : 'default',
    sum: function() {
      if( lowest_max ) {
        return _.clamp(
          data.base_value,
          0,
          lowest_max
        )
      }
      return data.base_value
    },
  }
}

module.exports.createFromData = createStatFromData
