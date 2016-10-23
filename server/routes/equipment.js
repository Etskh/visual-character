'use strict'

const express = require('express')
const equipment = require('../lib/equipment')
const router = express.Router()

router.get('/', function (req, res) {
  equipment.getAllEquipmentData(
    // empty
  ).then(function(equipmentTypes) {
    return res.render('equipment/index.html', {
      equipmentTypes: equipmentTypes,
    })
  })
})

router.get('/:title', function (req, res) {
  equipment.getEquipmentDataByTitle(
    req.params.title
  ).then(function(item) {
    return res.render('equipment/detail.html', {
      item: item,
      owned: req.query.owned,
    })
  }, function(error) {
    return res.end(JSON.stringify(error))
  })
})


module.exports = router
