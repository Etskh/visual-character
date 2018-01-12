/* global describe:false, it:false, before:false, after:false */
// eslint-disable-next-line import/no-extraneous-dependencies
import expect from 'expect';
import sinon from 'sinon';

import Fetch from '../../../client/lib/Fetch';


describe('Lib:Fetch', () => {
  Fetch.jQuery = {
    ajax: () => {
      // empty
    },
  };

  describe(':get', () => {
    describe('success', () => {
      const fixture = {
        id: 42,
        name: 'charles',
      };
      before(() => {
        sinon.stub(Fetch.jQuery, 'ajax').callsFake((options) => {
          expect(options.url).toBe('/api/model/42');
          options.success(fixture, 'success');
        });
      });
      after(() => {
        Fetch.jQuery.ajax.restore();
      });

      it('get will check the web for the model and id', () => Fetch.get('model', 42).then((data) => {
        expect(data).toBe(fixture);
      }));
    });

    describe('errors', () => {
      before(() => {
        sinon.stub(Fetch.jQuery, 'ajax').callsFake((options) => {
          options.error(null, 'uh oh', 'timeout');
        });
      });
      after(() => {
        Fetch.jQuery.ajax.restore();
      });
      it('get will reject if the server is down', () => Fetch.get('model', 42).then(() => {
        expect(false).toBe('You should not reach here');
      }).catch((err) => {
        expect(err.message).toEqual(JSON.stringify({
          textStatus: 'uh oh',
          httpError: 'timeout',
        }));
        return Promise.resolve();
      }));
    });
  });

  describe(':save', () => {
    describe('success', () => {
      const fixture = {
        id: 42,
        name: 'charles',
      };
      before(() => {
        sinon.stub(Fetch.jQuery, 'ajax').callsFake((options) => {
          expect(options.url).toBe('/api/model/42');
          options.success(fixture, 'success');
        });
      });
      after(() => {
        Fetch.jQuery.ajax.restore();
      });

      it('get will check the web for the model and id', () => Fetch.save('model', 42).then((data) => {
        expect(data).toBe(fixture);
      }));
    });

    describe('errors', () => {
      before(() => {
        sinon.stub(Fetch.jQuery, 'ajax').callsFake((options) => {
          options.error(null, 'uh oh', 'timeout');
        });
      });
      after(() => {
        Fetch.jQuery.ajax.restore();
      });
      it('get will reject if the server is down', () => Fetch.save('model', 42).then(() => {
        expect(false).toBe('You should not reach here');
      }).catch((err) => {
        expect(err.message).toEqual(JSON.stringify({
          textStatus: 'uh oh',
          httpError: 'timeout',
        }));
        return Promise.resolve();
      }));
    });
  });
});
