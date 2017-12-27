const fs = require('fs');

function getModelPath(model) {
  return `./data/${model}s.json`;
}

function loadAll(model) {
  return new Promise((resolve, reject) => {
    return fs.readFile(getModelPath(model), (err, contents) => {
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
      return resolve(data);
    });
  });
}



function saveAll(model, data) {
  return new Promise( (resolve, reject) => {
    const allCharacterData = JSON.stringify(data, null, 2);
    return fs.writeFile(characterPath, allCharacterData, (writeErr) => {
      if (writeErr) {
        return reject(writeErr);
      }
      return resolve(character);
    });
  });
}

module.exports = {
  get: (model, id) => {
    return new Promise( (resolve, reject) => {
      return loadAll(model).then( all => {
        const character = all.find(c => parseInt(c.id, 10) === parseInt(id, 10));
        if (!character) {
          // TODO: log
          return reject(new Error(`No ${model} with id ${id}`));
        }
        return resolve(character);
      });
    });
  },
  save: (model, id, data) => {
    return loadAll(model).then( all => {
      const character = all.find(c => parseInt(c.id, 10) === parseInt(id, 10));
      if (!character) {
        // TODO: log
        return reject(new Error(`No ${model} with id ${id}`));
      }
      // Write the new fields into this
      Object.keys(character).forEach((field) => {
        current[field] = character[field];
      });
      return saveAll(model, all);
    });
  },
};
