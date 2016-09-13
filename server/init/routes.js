'use strict'

// TODO: Move this to ./server/init

const express = require('express')

const router = express.Router()



router.get('/', function (req, res) {
  const user = res.locals.user
  user.getCharacters().then(function(characters) {
    res.render('index.html', {
      characters: characters,
    })
  }, function(error){
    return res.render('uhoh.html', { error: error })
  })
})


router.get('/character/:id', function (req, res) {
  const user = res.locals.user
  user.hasPermissionToCharacter(
    req.params.id
  ).then(function(character) {

    user.saveActiveCharacter(req.params.id)

    res.render('character/index.html', {
      character: character,
    })
  }, function(error){
    return res.render('uhoh.html', { error: error })
  })
})




function characterPageHandler( page ) {
  return function (req, res) {
    const user = res.locals.user
    user.hasPermissionToCharacter(
      req.params.id
    ).then(function(character) {
      res.render('character/' + page + '.html', {
        character: character,
      })
    }, function(error){
      return res.render('uhoh.html', { error: error })
    })
  }
}

router.get('/character/:id/overworld', characterPageHandler('main') )
router.get('/character/:id/combat', characterPageHandler('combat') )
router.get('/character/:id/magic', characterPageHandler('magic') )
router.get('/character/:id/equipment', characterPageHandler('equipment') )
router.get('/character/:id/statistics', characterPageHandler('statistics') )
router.get('/character/:id/debug', characterPageHandler('debug') )



const equipment = require('../lib/equipment')

router.get('/equipment', function(req, res) {

  equipment.getAllEquipmentData(
    // empty
  ).then(function(equipmentTypes) {
    return res.render('equipment/index.html', {
      equipmentTypes: equipmentTypes
    })
  })
})






router.post('/action', require('body-parser').json(), function (req, res) {
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

    return func.call(this, args)
  }).then(function(character) {

    const json = {
      'success': true,
    }

    switch(req.body.return) {
    case 'equipment':
      json.stats = {
        'current_load': character.current_load,
        'current_load_percentage': character.current_load_percentage,
        'equipment': character.equipment,
        'carry_weight': character.carry_weight,
      }
    }

    // TODO: Make this actually flexible
    if( req.body.partial ) {
      var item = {
        name: 'item_X',
        id: 1,
        count: 1,
        weight: 1,
      }
      return res.render('equipment/item.partial.html', {
        item: item
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
      'error': error,
    })
  })
})


module.exports = router
