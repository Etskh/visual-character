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


module.exports = router
