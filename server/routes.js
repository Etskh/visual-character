'use strict'

const express = require('express')

const router = express.Router()

router.get('/', function (req, res) {
  const user = res.locals.user
  user.getCharacters(
    // empty
  ).then(function(characters) {
    console.log(characters)
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
    res.render('character.html', {
      character: character,
    })
  }, function(error){
    return res.render('uhoh.html', { error: error })
  })
})



module.exports = router
