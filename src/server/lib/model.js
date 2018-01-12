import fs from 'fs';
import Logger from './logger';

export function getModelPath(model) {
  return `./data/${model}s.json`;
}

export function loadAll(model) {
  return new Promise((resolve, reject) => fs.readFile(getModelPath(model), (err, contents) => {
    if (err) {
      Logger.error({
        action: 'model::loadAll',
        model,
        err,
      });
      return reject(err);
    }
    let data = null;
    try {
      data = JSON.parse(contents.toString());
    } catch (jsonParseErr) {
      Logger.error({
        action: 'model::loadAll',
        model,
        jsonParseErr,
      });
      return reject(jsonParseErr);
    }
    return resolve(data);
  }));
}

export function saveAll(model, data) {
  return new Promise((resolve, reject) => {
    const allCharacterData = JSON.stringify(data, null, 2);
    return fs.writeFile(getModelPath(model), allCharacterData, (writeErr) => {
      if (writeErr) {
        Logger.error({
          action: 'model::saveAll',
          model,
          data,
          writeErr,
        });
        return reject(writeErr);
      }
      return resolve(data);
    });
  });
}

export const get = (model, id) => new Promise(resolve => loadAll(model).then((all) => {
  const character = all.find(c => parseInt(c.id, 10) === parseInt(id, 10));
  if (!character) {
    Logger.warn({
      action: 'model::get',
      model,
      id,
      err: `No ${model} with id ${id}`,
    });
    return resolve(null);
  }
  return resolve(character);
}));

export const save = (model, id, data) => loadAll(model).then((all) => {
  const character = all.find(c => parseInt(c.id, 10) === parseInt(id, 10));
  if (!character) {
    Logger.error({
      action: 'model::save',
      model,
      id,
      err: `No ${model} with id ${id}`,
    });
    return Promise.reject(new Error(`No ${model} with id ${id}`));
  }
  // Write the new fields into this
  Object.keys(character).forEach((field) => {
    character[field] = data[field];
  });
  return saveAll(model, all).then(() => character);
});
