'use strict'


const equipment = require('../lib/equipment')
const _ = require('lodash')

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
