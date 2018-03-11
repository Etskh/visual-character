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

// TODO: implement software rate-limiting

router.post('/login', (req, res) => {
  Model.getByField('user', 'username', req.body.username).then((user) => {
    if (!user) {
      return res.status(401).send({
        error: 'NOT_AUTH',
      });
    }

    return res.send(user);
  }).catch(apiErrorHandler.bind(this, res));
});

module.exports = router;
