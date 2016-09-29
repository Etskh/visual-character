'use strict'

const equipment = require('../lib/equipment')

//const express = require('express')
//const router = express.Router()

/*
router.get('/:id', function (req, res) {
  const user = res.locals.user
  user.hasPermissionToCharacter(
    req.params.id
  ).then(function(character) {
  });
});
*/

const handler = function (req, res) {

  equipment.getAllEquipmentData(
    // empty
  ).then(function(equipmentTypes) {
    return res.render('equipment/index.html', {
      equipmentTypes: equipmentTypes
    })
  })
}

module.exports = handler
