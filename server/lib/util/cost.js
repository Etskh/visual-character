'use strict'

module.exports.toSmallestDenomination = function( value ) {
  const result = []
  const formatting = [
    // No gaps betwen unit and value without commas:
    '', ' '        // 1gp 1sp
    // Gaps between unit and value without commas:
    //' ', ' '    // 1 gp 1 sp
    // No gaps between unit and value with commas:
    //'', ', '    // 1gp, 1sp, 1cp
    // Gaps between unit and value with commas:
    //' ', ', '   // 1 gp, 1 sp
  ]
  const denominations = [
    { name: 'cp', value: 1 },
    { name: 'sp', value: 10 },
    { name: 'gp', value: 100 },
    //{ name: 'pp', value: 1000 },
  ]

  for ( let d = denominations.length - 1 ; d >= 0; --d ) {
    if ( value >= denominations[d].value ) {
      let rounded = parseInt(
          value / denominations[d].value
        )

      result.push([rounded, denominations[d].name].join(formatting[0]))
      value -= rounded * denominations[d].value
    }
  }

  return result.join(formatting[1])
}
