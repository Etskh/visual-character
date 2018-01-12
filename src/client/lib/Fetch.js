/* global $:false */

export default class Fetch {
  static get(model, id) {
    if (Fetch.jQuery === null) {
      Fetch.jQuery = $;
    }
    return new Promise((resolve, reject) => {
      Fetch.jQuery.ajax({
        url: `/api/${model}/${id}`,
        method: 'GET',
        success: obj => resolve(obj),
        error: (_, textStatus, errorThrown) => reject(new Error(JSON.stringify({
          textStatus,
          httpError: errorThrown,
        }))),
      });
    });
  }

  static save(model, id, data) {
    if (Fetch.jQuery === null) {
      Fetch.jQuery = $;
    }
    return new Promise((resolve, reject) => {
      Fetch.jQuery.ajax({
        url: `/api/${model}/${id}`,
        method: 'POST',
        data,
        success: obj => resolve(obj),
        error: (_, textStatus, errorThrown) => reject(new Error(JSON.stringify({
          textStatus,
          httpError: errorThrown,
        }))),
      });
    });
  }
}

// For mocking the tests, let's export jQuery
Fetch.jQuery = null;
