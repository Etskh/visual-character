'use strict'

// TODO: Move this to ./server/init

const express = require('express')
const _ = require('lodash')
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






router.post('/action', require('body-parser').json(), require('../routes/action'))


module.exports = router
