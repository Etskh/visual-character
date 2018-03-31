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
  itemCategories,
  itemTypes,
  materials,
  materialTypes,
  getItem,
  getItemsWorth,
  getRandomItemsWorth,
} from '../../../client/lib/Items';

describe('Lib:Items', () => {
  it('categories follow rules', () => {
    const itemCategoryRules = {
      name: 'string',
      // If it can equip, it must be in a slot
      slot: {
        optional: SLOTS,
      },
      // How to make this item - if it's not here, we EXPECT it to
      // be in every child itemType
      craftSkill: {
        optional: CRAFT_SKILLS,
      },
      // Used to validate itemTypes with category: this
      typeRules: 'ignore',
      // Used to validate inventory items with category: this
      dataRules: 'ignore',
      // Used to get data for the item
      dataGetter: 'ignore',
    };
    itemCategories.forEach((cat) => {
      expect(checkDataAgainstRules(cat, itemCategoryRules)).toBe(true);
    });
  });

  it('types follow rules', () => {
    const itemTypeRules = {
      name: 'string',
      description: 'string',
      weight: 'number',
      cost: 'number',
      category: itemCategories.map(cat => cat.name),
      defaultMaterial: materials.map(mat => mat.name),
      defaultCount: {
        optional: 'number',
      },
      // Later, verify that it's an action
      // actions: 'ignore',
      data: 'ignore',
    };
    itemTypes.forEach((type) => {
      const category = itemCategories.find(c => c.name === type.category);
      expect(checkDataAgainstRules(type, itemTypeRules)).toBe(true);
      if (category.typeRules) {
        expect(checkDataAgainstRules(type.data, category.typeRules)).toBe(true);
      }
    });
  });

  it('materials follow rules', () => {
    const materialRules = {
      name: 'string',
      hp: 'number',
      hardness: 'number',
      type: materialTypes.map(mt => mt.name),
      dataGetter: 'ignore',
    };
    materials.forEach((mat) => {
      expect(checkDataAgainstRules(mat, materialRules)).toBe(true);
    });
  });

  it('getItem returns usable items', () => {
    const item = getItem({
      id: 1,
      itemType: 'heavy metal shield',
      material: 'mithral',
      data: {
        isMasterwork: true,
      },
    });
    const itemRules = {
      id: 'number',
      name: 'string',
      weight: 'number', // in pounds (per item)
      count: 'number',
      itemType: 'object',
      material: 'object',
      category: 'object',
      data: 'object',
    };
    expect(checkDataAgainstRules(item, itemRules)).toBe(true);
    expect(item.count).toBe(1);
    expect(item.weight).toBe(7.5);
    expect(item.data.ac).toBeA('object');
    expect(item.data.ac.total).toBe(2);
    expect(item.data.check_penalty).toBeA('object');
    expect(item.data.check_penalty.total).toBe(-1);
  });

  it('getItemsWorth works as expected', () => {
    const itemList = getItemsWorth(3.45);
    expect(itemList.length).toBe(1);
    expect(itemList[0].itemType).toBe('gold piece');
    expect(itemList[0].count).toBe(4);
    // expect(itemList[1].itemType).toBe('silver piece');
    // expect(itemList[1].count).toBe(4);
    // expect(itemList[2].itemType).toBe('copper piece');
    // expect(itemList[2].count).toBe(5);
  });

  it('getRandomItemsWorth works as expected', () => {
    const items = getRandomItemsWorth(3000);
    expect(items.length).toNotBe(1);
  });
});
