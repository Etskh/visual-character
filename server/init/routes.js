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

    res.render('character/all.html', {
      character: character,
    })
  }, function(error){
    return res.render('uhoh.html', { error: error })
  })
})

router.post('/action', require('body-parser').json(), function (req, res) {
  const user = res.locals.user

  user.getActiveCharacter(
    // empty
  ).then(function(character) {
    // Allow execution of arbitrary code (lol)

    var args = req.body['args[]']
    var func = character[req.body.action]

    if( !args.length ) {
      args = [args]
    }

    return func.apply(character, args)

  }).then(function(character) {

    switch(req.body.return) {
    case 'equipment':
      return res.json({
        'success': true,
        'stats': {
          'current_load': character.current_load,
          'current_load_percentage': character.current_load_percentage,
          'equipment': character.equipment,
          'carry_weight': character.carry_weight,
        },
      })
    }

    return res.json({
      'success': true
    })
  }, function(error){
    return res.json({
      'success': false,
      'error': error,
    })
  })
})


module.exports = router
