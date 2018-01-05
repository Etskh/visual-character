const express = require('express');
const bodyParser = require('body-parser');
const model = require('../lib/model');

const router = express.Router();
router.use(bodyParser.urlencoded({
  extended: true
}));
router.use(bodyParser.json());

// define the home page route
router.get('/character/:id', (req, res) => model.get('character', req.params.id).then(character => res.send(character)).catch(err => res.send({
  error: err,
})));

// define the home page route
router.post('/character/:id', (req, res) => model.save('character', req.params.id, req.body).then(res.send)
  .catch(err => res.send({
    error: err,
  })));

module.exports = router;
