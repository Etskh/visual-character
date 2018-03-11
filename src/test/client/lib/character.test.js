/* global describe:false, it:false */
// eslint-disable-next-line import/no-extraneous-dependencies
import expect from 'expect';
import {
  parseData,
} from '../../../client/lib/Character';

const characterFixture = require('../../fixtures/character.json');

describe('Lib:Character', () => {
  it('can create parse data!', () => {
    const char = {
      choices: [],
    };
    const data = parseData(char);

    expect(data).toBeA('object');
  });

  it('can compute stats', (done) => {
    const input = Object.assign({}, characterFixture);
    const outputStats = {
      str: 9,
      str_mod: -1,
    };
    parseData(input).then((data) => {
      Object.keys(outputStats).forEach((field) => {
        expect(data[field].getTotal()).toBe(outputStats[field]);
      });
      done();
    });
    // console.log(Object.keys(data).map(field => `${field}: ${data[field].getTotal()}`));
  });
});
