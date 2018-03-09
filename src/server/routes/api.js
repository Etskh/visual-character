// TODO: make this Es20115 syntax
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as Model from '../lib/model';
import * as Logger from '../lib/logger';

const router = express.Router();
router.use(bodyParser.urlencoded({
  extended: true
}));
router.use(bodyParser.json());

const apiErrorHandler = (res, err) => {
  Logger.error(err);
  return res.status(500).send({
    error: err,
  });
};

// List all the models that we'll save here
const models = [
  'character',
  'user',
];

models.forEach((modelName) => {
  // Get route
  // TODO: add /all as a special id that returns all the models
  router.get(`/${modelName}/:id`, (req, res) => Model.get(modelName, req.params.id).then(obj => res.send(obj)).catch(apiErrorHandler.bind(this, res)));
  // Post route
  router.post(`/${modelName}/:id`, (req, res) => {
    const model = (req.params.id === 'new' ?
      Model.create(modelName, req.body)
      : Model.save(modelName, req.params.id, req.body));

    return model.then(obj => res.send(obj)).catch(apiErrorHandler.bind(this, res));
  });
});

module.exports = router;
