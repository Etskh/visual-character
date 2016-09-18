'use strict'

// TODO: Move this to ./server/init

const _ = require('lodash')
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


router.use('/character', require('../routes/character'))


router.get('/equipment', require('../routes/equipment'))
router.post('/action', require('body-parser').json(), require('../routes/action'))


module.exports = router
