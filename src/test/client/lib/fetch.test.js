/* global describe:false, it:false */
// eslint-disable-next-line import/no-extraneous-dependencies
import expect from 'expect';
import sinon from 'sinon';

import Fetch from '../../../client/lib/Fetch';


describe('Lib:Fetch', () => {

  describe('get:success', () => {
    const fixture = {
      id: 42,
      name: 'charles',
    };
    let fetchMock;
    before(() => {
      fetchMock = sinon.stub(Fetch.jQuery, 'ajax').callsFake( (options) => {
        expect(options.url).toBe('/api/model/42');
        options.success(fixture, 'success');
      });
    });
    after(() => {
      Fetch.jQuery.ajax.restore();
    });

    it('get will check the web for the model and id', () => {
      return Fetch.get('model', 42).then( data => {
        expect(data).toBe(fixture);
      });
    });
  });

  describe('get:errors', () => {
    let fetchMock;
    before(() => {
      fetchMock = sinon.stub(Fetch.jQuery, 'ajax').callsFake( (options) => {
        options.error(null, 'uh oh', 'timeout');
      });
    });
    after(() => {
      Fetch.jQuery.ajax.restore();
    });
    it('get will reject if the server is down', () => {
      return Fetch.get('model', 42).then( data => {
        expect(false).toBe('You should not reach here');
      }).catch( err => {
        expect(err).toEqual({
          textStatus: 'uh oh',
          httpError: 'timeout',
          xhr: null,
        });

        return Promise.resolve();
      })
    });
  });
});
