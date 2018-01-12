/* global $:false */

export default class Fetch {
  static get(model, id) {
    if( Fetch.jQuery === null ) {
      Fetch.jQuery = $;
    }
    return new Promise((resolve, reject) => {
      Fetch.jQuery.ajax({
        url: `/api/${model}/${id}`,
        method: 'GET',
        success: (obj) => {
          return resolve(obj);
        },
        error: (jqXhr, textStatus, errorThrown) => {
          return reject({
            textStatus,
            httpError: errorThrown,
            xhr: jqXhr,
          });
        },
      });
    });
  }

  static save(model, id, data) {
    if( Fetch.jQuery === null ) {
      Fetch.jQuery = $;
    }
    return new Promise((resolve, reject) => {
      Fetch.jQuery.ajax({
        url: `/api/${model}/${id}`,
        method: 'POST',
        data: data,
        success: (obj) => {
          return resolve(obj);
        },
        error: (jqXhr, textStatus, errorThrown) => {
          return reject({
            textStatus,
            httpError: errorThrown,
            xhr: jqXhr,
          });
        },
      });
    });
  }
}

// For mocking the tests, let's export jQuery
Fetch.jQuery = null;
