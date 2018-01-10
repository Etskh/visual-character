/* global describe:false, it:false */
// eslint-disable-next-line import/no-extraneous-dependencies
import expect from 'expect';
import {
  createData,
} from '../../../client/lib/Data';

describe('Lib:Data', () => {
  it('can create data ', () => {
    const data = createData('str');
    expect(data.getTotal()).toBe(0);
    expect(data.getName()).toBe('str');
  });

  it('can create add choices to the data', () => {
    const data = createData('str');

    data.addChoice('base_stat', 12, {
      // ... some choice object ...
    });

    expect(data.getTotal()).toBe(12);
  });

  it('can add a base', () => {
    const data = createData('ac');
    data.addBaseValue(10);
    expect(data.getTotal()).toBe(10);
  });

  it('can have transformations', () => {
    const data = createData('str', val => (val / 2) - 5);
    data.addBaseValue(12);

    expect(data.getTotal()).toBe(1);
  });

  it('can add an item, and it will look for the right data field', () => {
    const item = {
      name: 'Shield',
      itemType: {
        data: {
          ac: 2,
          check_penalty: -2,
        },
      },
    };
    const data = createData('ac');
    data.addItem(item);
    data.addBaseValue(10);

    expect(data.getTotal()).toBe(12);
  });

  it('can add effects', () => {
    const str = createData('str');
    str.addBaseValue(12);
    str.addEffect({
      name: 'Rage',
      data: {
        str: 4,
      },
    });
    str.addEffect({
      name: 'Bull\'s Strength',
      data: {
        str: 4,
      },
    });

    expect(str.getTotal()).toBe(20);
  });

  it('can add data object', () => {
    const ctx = {
      str: createData('str'),
      str_mod: createData('str_mod', val => (val / 2) - 5),
    };
    ctx.str.addBaseValue(18);

    ctx.str_mod.addData(ctx.str);

    ctx.str.addItem({
      name: 'Magical something',
      itemType: {
        data: {
          str: 2,
        },
      },
    });
    // We expect it will add up the sources ( 18 + 2 == 20 ) 20 / 2 - 5 = 5
    expect(ctx.str_mod.getTotal()).toBe(5);
  });
});
