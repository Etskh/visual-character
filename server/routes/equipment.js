'use strict'

const express = require('express')
const equipment = require('../lib/equipment')
const router = express.Router()

router.get('/', function (req, res) {
  equipment.getAllEquipmentData(
    // empty
  ).then(function(equipmentTypes) {
    return res.render('equipment/index.html', {
      equipmentTypes: equipmentTypes
    })
  })
})

router.get('/:title', function (req, res) {
  equipment.getEquipmentDataByName(
    req.params.name
  ).then(function(equipment) {
    return res.reply('Wow!')
  })
})


module.exports = router
