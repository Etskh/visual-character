/* global describe:false, it:false */
// eslint-disable-next-line import/no-extraneous-dependencies
import expect from 'expect';
import {
  checkDataAgainstRules,
} from '../../../client/lib/core';
import {
  SLOTS,
  CRAFT_SKILLS,
} from '../../../client/lib/constants';
import {
  parseData,
} from '../../../client/lib/Character';

describe('Lib:Character', () => {
  it('can create parse data!', () => {
    const char = {
      choices: [],
    };
    const data = parseData(char);

    expect(data).toBeA('object');
  });

  it('can compute stats', () => {
    const input = require('../../fixtures/character.json');
    const outputStats = {
      str: 9,
      str_mod: -1,
    };
    const data = parseData(input);


    console.log(Object.keys(data).map( field => {
      return `${field}: ${data[field].getTotal()}`;
    }));
    

    Object.keys(outputStats).forEach( field => {
      expect(data[field].getTotal()).toBe(outputStats[field]);
    });
  });
});
