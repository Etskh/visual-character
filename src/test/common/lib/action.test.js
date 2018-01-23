/* global describe:false, it:false */
// eslint-disable-next-line import/no-extraneous-dependencies
import expect from 'expect';
import sinon from 'sinon';
import * as Action from '../../../common/Action';

describe('Common:Action', () => {
  describe(':create', () => {
    it('can create an action without a callback', () => {
      const action = Action.create('sansCallback');
      expect(action.name).toBe('sansCallback');
      expect(action.defaultCallback).toBe(null);
      expect(action.instances).toEqual({});
    });
    it('can create an action with a callback', () => {
      const callback = () => {};
      const action = Action.create('avecCallback', callback);
      expect(action.name).toBe('avecCallback');
      expect(action.defaultCallback).toBe(callback);
      expect(action.instances).toEqual({});
    });
    it('will throw an exception if you create more than one with the same name', () => {
      const actionCreate = sinon.spy(Action.create);
      try {
        actionCreate('dupedAction');
        actionCreate('dupedAction');
      } catch (e) {
        // pass
      }
      expect(actionCreate.threw()).toBe(true);
    });
  });

  describe(':subscribe/unsubscribe', () => {
    it('can subscribe to an action', () => {
      const callback = () => {};
      const action = Action.create('subbedAction');
      Action.subscribe(__filename, 'subbedAction', callback);
      expect(action.instances[__filename]).toBe(callback);
    });
    it('can unsubscribe to an action', () => {
      const callback = () => {};
      const action = Action.create('unsubbedAction');
      Action.subscribe(__filename, 'unsubbedAction', callback);
      Action.unsubscribe(__filename, 'unsubbedAction');
      expect(action.instances[__filename]).toBe(null);
    });
  });

  describe(':fire', () => {
    it('calls default callback', () => {
      const callback = sinon.spy();
      const actionData = {
        random: 111,
      };
      Action.create('firingAction', callback);
      Action.fire('firingAction', actionData).then(() => {
        expect(callback.calledWith(actionData)).toBe(true);
      });
    });
    it('calls subscribe instances callback', () => {
      const callback = sinon.spy();
      const actionData = {
        random: 111,
      };
      Action.create('firedSubbedAction');
      Action.subscribe(__filename, 'firedSubbedAction', callback);
      return Action.fire('firedSubbedAction', actionData).then(() => {
        expect(callback.calledWith(actionData)).toBe(true);
      });
    });
    it('allows the default to return different data', () => {
      const changedData = {
        other: 111,
      };
      const callback = sinon.spy();
      Action.create('dataChangeAction', () => (changedData));
      Action.subscribe(__filename, 'dataChangeAction', callback);
      return Action.fire('dataChangeAction', null).then(() => {
        expect(callback.calledWith(changedData)).toEqual(true);
      });
    });
    it('allows the default to return a promise to create data', () => {
      const changedData = {
        other: 111,
      };
      const callback = sinon.spy();
      Action.create('promiseChangeAction', () => Promise.resolve(changedData));
      Action.subscribe(__filename, 'promiseChangeAction', callback);
      return Action.fire('promiseChangeAction', null).then(() => {
        expect(callback.calledWith(changedData)).toEqual(true);
      });
    });
  });

  describe(':unsubscribeAll', () => {
    it('can unsubscribe all actions', () => {
      const callback = sinon.spy();
      Action.create('unsubAllAction_1');
      Action.create('unsubAllAction_2');
      Action.subscribe(__filename, 'unsubAllAction_1', callback);
      Action.subscribe(__filename, 'unsubAllAction_2', callback);
      Action.unsubscribeAll(__filename);
      return Promise.all([
        Action.fire('unsubAllAction_1'),
        Action.fire('unsubAllAction_2'),
      ]).then(() => {
        expect(callback.called).toBe(false);
      });
    });
  });
});
