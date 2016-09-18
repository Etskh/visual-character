'use strict'

const express = require('express')
const router = express.Router()


router.get('/:id', function (req, res) {
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

router.get('/:id/overworld', characterPageHandler('main') )
router.get('/:id/combat', characterPageHandler('combat') )
router.get('/:id/magic', characterPageHandler('magic') )
router.get('/:id/equipment', characterPageHandler('equipment') )
router.get('/:id/statistics', characterPageHandler('statistics') )
router.get('/:id/debug', characterPageHandler('debug') )

module.exports = router
