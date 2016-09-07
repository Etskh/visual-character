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

    user.saveActiveCharacter(req.params.id);

    res.render('character/all.html', {
      character: character,
    })
  }, function(error){
    return res.render('uhoh.html', { error: error })
  })
})

router.get('/action', function (req, res) {
  const user = res.locals.user

  user.getActiveCharacter().then(function(character) {

    //character.dropItem(req.params.itemId)
    character.save()

    return res.json({
      'success': true,
      'current_load_percentage': character.current_load_percentage,
    })
  }, function(error){
    return res.json({
      'success': false,
      'error': error,
    })
  })
})


module.exports = router
