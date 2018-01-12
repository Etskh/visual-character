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


Fetch.jQuery = null;
