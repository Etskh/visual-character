const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const model = require('../lib/model');

const router = express.Router();
router.use(bodyParser.urlencoded({
  extended: true
}));
router.use(bodyParser.json());

const characterPath = './data/characters.json';
const loadCharacter = id => new Promise((resolve, reject) => {
  fs.readFile(characterPath, (err, contents) => {
    if (err) {
      // TODO: log
      return reject(err);
    }
    let data = null;
    try {
      data = JSON.parse(contents.toString());
    } catch (jsonParseErr) {
      // TODO: log
      return reject(jsonParseErr);
    }
    const character = data.find(c => parseInt(c.id, 10) === parseInt(id, 10));
    if (!character) {
      // TODO: log
      // TODO: Resolve with null
      return reject(new Error(`No character with id ${id}`));
    }
    return resolve(character);
  });
});

const saveCharacter = character => new Promise((resolve, reject) =>
  fs.readFile(characterPath, (err, contents) => {
    if (err) {
      // TODO: log
      return reject(err);
    }
    let data = null;
    try {
      data = JSON.parse(contents.toString());
    } catch (jsonParseErr) {
      // TODO: log
      return reject(jsonParseErr);
    }
    const current = data.find(c => parseInt(c.id, 10) === parseInt(character.id, 10));
    if (!current) {
      // TODO: log
      // TODO: Resolve with null
      return reject(new Error(`No character with id ${character.id}`));
    }
    //
    // Write the new fields into this
    Object.keys(character).forEach((field) => {
      current[field] = character[field];
    });
    //
    const allCharacterData = JSON.stringify(data, null, 2);
    return fs.writeFile(characterPath, allCharacterData, (writeErr) => {
      if (writeErr) {
        return reject(writeErr);
      }
      return resolve(character);
    });
  }));


// define the home page route
router.get('/character/:id', (req, res) => {
  return model.get('character', req.params.id).then( character => {
    return res.send(character);
  }).catch( err => {
    return res.send({
      error: err,
    });
  });
});

// define the home page route
router.post('/character/:id', (req, res) => {
  return model.save('character', req.params.id, req.body).then(res.send)
    .catch((err) => {
      return res.send({
        error: err,
      });
    });
});

module.exports = router;
