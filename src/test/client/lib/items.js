
import expect from 'expect';
import {
  itemCategories,
} from '../../../client/lib/Items';

describe('Lib:Items', () => {

  it('Item categories follow rules', (done) => {

    itemCategories.forEach( cat => {
      expect(cat.name).toBeA('string');
    });

    done();
  });
});
