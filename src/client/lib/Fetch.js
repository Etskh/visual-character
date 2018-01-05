/* global $:false */

export default class Fetch {
  static get(model, id) {
    return new Promise((resolve, reject) => {
      $.get(`/api/${model}/${id}`, (obj, success) => {
        if (success !== 'success') {
          return reject(obj);
        }

        return resolve(obj);
      });
    });
  }

  static save(model, id, data) {
    return new Promise((resolve, reject) => {
      $.post(`/api/${model}/${id}`, data, (obj, success) => {
        if (success !== 'success') {
          return reject(obj);
        }

        return resolve(obj);
      });
    });
  }
}
