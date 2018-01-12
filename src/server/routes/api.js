// TODO: make this Es20115 syntax
const express = require('express');
const bodyParser = require('body-parser');
const Model = require('../lib/model');

const router = express.Router();
router.use(bodyParser.urlencoded({
  extended: true
}));
router.use(bodyParser.json());

const apiErrorHandler = ( res, err ) => {
  // TODO: make this a logger, not a console
  console.error(err);
  return res.status(500).send({
    error: err,
  });
};

const models = [
  'character',
  'user',
];

models.forEach( modelName => {
  // Get route
  router.get(`/${modelName}/:id`, (req, res) => Model.get(modelName, req.params.id).then(obj => res.send(obj)).catch(apiErrorHandler.bind(this, res)));
  // Post route
  // TODO: add special handling for 'new'
  router.post(`/${modelName}/:id`, (req, res) => Model.save(modelName, req.params.id, req.body).then( obj => res.send(obj))
    .catch(apiErrorHandler.bind(this, res)));
});

module.exports = router;
