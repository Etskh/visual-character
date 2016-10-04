'use strict'


const _ = require('lodash')



const handler = function (req, res) {
  const user = res.locals.user

  user.getActiveCharacter(
    // empty
  ).then(function(character) {
    // Allow execution of arbitrary code (lol)

    // TODO: Pull this out
    var args = req.body['args[]']
    var func = character[req.body.action]

    if( !func ) {
      return res.json({
        'success': false,
        'error': + req.body.action + ' is not a function',
      })
    }

    if( typeof args !== 'object' ) {
      args = [ args ]
    }

    return func.apply(this, args)
  }).then(function(character) {

    const json = {
      'success': true,
    }

    switch(req.body.return) {
    case 'equipment':
      json.stats = {
        'current_load': character.current_load,
        'current_load_percentage': character.current_load_percentage,
        //'equipment': character.equipment,
        'carry_weight': character.carry_weight,
      }
    }

    // TODO: Make this actually flexible
    if( req.body.partial === 'newest-item' ) {

      const newestItem = _.maxBy(character.equipment, 'id')

      return res.render('equipment/item.partial.html', {
        item: newestItem,
        flash: req.body.flash,
      }, function( err, html ) {
        if(err) {
          json.success = false
          return res.json(json)
        }

        json.partial = html
        return res.json(json)
      })
    }

    return res.json(json)
  }, function(error){
    return res.json({
      'success': false,
      'error': JSON.stringify(error),
    })
  })
}


module.exports = handler
