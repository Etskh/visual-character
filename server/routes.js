'use strict'

const express = require('express')

const router = express.Router()

router.get('/', function (req, res) {
  const user = res.locals.user
  user.getCharacters(
    // empty
  ).then(function(characters) {
    res.render('index.html', {
      characters: characters,
    })
  }, function(error){
    return res.render('uhoh.html', { error: error })
  })
})

router.get('/character', function (req, res) {
  const user = res.locals.user
  user.getCharacters(
    // empty
  ).then(function(characters) {
    res.render('index.html', {
      characters: characters,
    })
  }, function(error){
    return res.render('uhoh.html', { error: error })
  })
})



module.exports = router
