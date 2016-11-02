'use strict'

const express = require('express')
const _ = require('lodash')

const equipment = require('../lib/equipment')
const router = express.Router()

router.get('/', function (req, res) {
  equipment.getAllTypes(
    // empty
  ).then(function(categories) {
    return res.render('equipment/index.html', {
      categories: categories,
    })
  })
})


router.get('/category/:category', function (req, res) {
  equipment.getByCategory(
    req.params.category
  ).then(function(equipmentTypes) {
    return res.render('equipment/category.html', {
      equipmentTypes: equipmentTypes,
      category: req.params.category,
    })
  })
})


router.get('/detail/:title', function (req, res) {

  let itemGetter = null;
  if ( req.query.owned ) {
    const user = res.locals.user
    itemGetter = new Promise(function(resolve, reject) {
      return user.getActiveCharacter().then(function(character) {
        var i = _.find(character.equipment, { 'id': parseInt(req.query.owned) })
        resolve(i)
      }, reject )
    })
  }
  else {
    itemGetter = equipment.getEquipmentDataByTitle(req.params.title);
  }

  itemGetter.then(function(item) {
    return res.render('equipment/detail.html', {
      item: item,
      owned: req.query.owned,
    })
  }, function(error) {
    return res.end(JSON.stringify(error))
  })
})


module.exports = router
