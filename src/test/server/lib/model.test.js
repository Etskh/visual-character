/* global describe:false, it:false */
// eslint-disable-next-line import/no-extraneous-dependencies
import expect from 'expect';
import sinon from 'sinon';
import * as Model from '../../../server/lib/model';
import fs from 'fs';

const characterFixture = require('../../fixtures/character.json');

describe('Lib:Model', () => {
  it('gets the path to the file in a standard way', () => {
    expect(Model.getModelPath('model')).toBe('./data/models.json')
  });
  /*after(() => {
    fs.readFile.restore();
  });

  it('can get a player from a file', () => {
    sinon.stub(fs, 'readFile').callsFake( (path, cb) => {

    });

    Model.get(0)
  });*/
});
