import {
  ATTACK_DICE,
  DAMAGE_TYPES,
  AMMO_TYPES,
} from './constants';
import { checkDataAgainstRules } from './core';


export const itemCategories = [{
  name: 'ammunition',
  slot: null,
  typeRules: {
    // Empty
  },
  masterworkEffect: (type) => {
    return {
      cost: 0,
      attack: 0,
    };
  },
  enchantmentEffect: (type, bonus) => {
    return {
      attack: 0,
      damage: 0,
    };
  },
}, {
  name: 'weapon',
  slot: 'main-hand',
  typeRules: {
    'complexity': [
      'simple',
      'martial',
      'exotic'
    ],
    'dice': ATTACK_DICE,
    'type': [
      'mace',
      'bow',
      'sword',
      'dagger',
      'crossbow',
    ],
    'damageType': DAMAGE_TYPES,
    'ammunition': {
      optional: AMMO_TYPES,
      needs: 'range',
    },
    'range': {
      optional: 'number',
      needs: 'ammunition',
    },
    'critRange': 'number',
    'critMult': 'number',
    'handed': [
      'light',
      'one',
      'two',
    ],
  },
  masterworkEffect: (type) => {
    return {
      cost: 300,
      attack: 1,
    };
  },
  enchantmentEffect: (type, bonus) => {
    return {
      attack: bonus - 1,
      damage: bonus,
    };
  },
}, {
  name: 'armour',
  craftSkill: 'armour',
  slot: 'torso',
  typeRules: {
    'weight': [
      'light',
      'medium',
      'heavy',
    ],
    'ac': 'number',
    'cp': 'number',
    'max_dex': 'number',
  },
  masterworkEffect: (type) => {
    return {
      cost: 150,
      cp: +1,
    };
  },
  enchantmentEffect: (type, bonus) => {
    return {
      cost: Math.pow(bonus,2) * 1000,
      ac: bonus,
    }
  },
}, {
  name: 'shield',
  craftSkill: 'armour',
  slot: 'off-hand',
  typeRules: {
    'weight': [
      'light',
      'heavy'
    ],
    'ac': 'number',
    'cp': 'number',
  },
  masterworkEffect: (type) => {
    return {
      cost: 150,
      cp: +1,
    };
  },
  enchantmentEffect: (type, bonus) => ({
    cost: Math.pow(bonus,2) * 1000,
    ac: bonus,
  }),
}, {
  name: 'boots',
  enchantmentEffect: () => ({}),
}];


const materialTypes = [{
  name: 'any',
}, {
  name: 'metal',
}, {
  name: 'wood',
}];


export const itemTypes = [{
  name: 'fullplate',
  weight: 50,
  cost: 1200,
  category: 'armour',
  materialType: 'metal',
  data: {
    weight: 'heavy',
    ac: 9,
    cp: -6,
    max_dex: 1,
  },
}, {
  name: 'chainmail',
  weight: 20,
  cost: 600,
  category: 'armour',
  materialType: 'metal',
  data: {
    weight: 'medium',
    ac: 6,
    cp: -3,
    max_dex: 3,
  },
}, {
  name: 'heavy metal shield',
  weight: 15,
  cost: 20,
  category: 'shield',
  materialType: 'metal',
  actions: [{
    name: 'Shield Bash',
    desc: 'Bash with your shield, but you lose the shield bonus',
  }],
  data: {
    weight: 'heavy',
    ac: 2,
    cp: -2,
  },
}, {
  name: 'morningstar',
  weight: 8,
  cost: 8,
  category: 'weapon',
  materialType: 'metal',
  data: {
    complexity: 'simple',
    dice: '1d8',
    type: 'mace',
    damageType: 'b/p',
    critRange: 1,
    critMult: 2,
    handed: 'one',
  },
}, {
  name: 'longbow',
  weight: 3,
  cost: 75,
  category: 'weapon',
  materialType: 'wood',
  data: {
    complexity: 'martial',
    dice: '1d8',
    type: 'bow',
    damageType: 'p',
    range: 100,
    ammunition: 'arrow',
    critRange: 1,
    critMult: 3,
    handed: 'two',
  },
}, {
  name: 'heavy crossbow',
  weight: 8,
  cost: 50,
  category: 'weapon',
  materialType: 'wood',
  data: {
    complexity: 'simple',
    dice: '1d10',
    type: 'crossbow',
    damageType: 'p',
    range: 120,
    ammunition: 'bolt',
    critRange: 2,
    critMult: 2,
    handed: 'two',
  },
}, {
  name: 'boots',
  weight: 0,
  cost: 0,
  category: 'boots',
  materialType: 'any',
}, {
  name: 'bolt',
  category: 'ammunition',
  cost: 0.1,
  weight: 0.1,
  materialType: 'wood',
  data: {
    // empty
  },
}];

itemTypes.forEach( type => {
  const itemTypeRules = {
    name: 'string',
    weight: 'number',
    cost: 'number',
    category: itemCategories.map( cat => ( cat.name )),
    materialType: 'string',
    // Later, verify that it's an action
    actions: 'ignore',
    data: 'ignore',
  };
  const category = itemCategories.find(c => c.name === type.category );
  if( !checkDataAgainstRules(type, itemTypeRules )
     || !category.typeRules ? false : !checkDataAgainstRules(type.data, category.typeRules) ) {
    console.error(`  in ${type.name}`);
  }
});

export const materials = [{
  name: 'wooden',
  type: 'wood',
  hp: 10,
  hardness: 5,
  calcEffect: () => {
    return {};
  },
}, {
  name: 'steel',
  type: 'metal',
  hp: 10,
  hardness: 30,
  calcEffect: () => {
    return {};
  },
}, {
  name: 'mithral',
  type: 'metal',
  hp: 30,
  hardness: 15,
  calcEffect: () => {
    return {};
  },
  calcCost: (itemType) => {
    if( itemType.category.name === 'armour') {
      switch( itemType.category.weight ) {
      case 'light':
        return 1000;
      case 'medium':
        return 4000;
      case 'heavy':
        return 9000;
      default:
        console.error(`Unknown armour type ${itemType.type.name}`);
      }
    }

    if( itemType.category === 'shield' ) {
      return 1000;
    }

    return itemType.weight * 500;
  }
}];


export const getItem = (item) => {
  // TODO: add item rules
  const itemRules = {
    // empty
  };

  item.itemType = itemTypes.find(t => t.name === item.itemType );
  item.material = materials.find(m => m.name === item.material );
  item.category = itemCategories.find(c => c.name === item.itemType.category );

  // What are the effects
  item.effects = {
    enchantment: item.category.enchantmentEffect(item.itemType, item.enchantment),
    masterwork: item.category.masterworkEffect(item.itemType),
    material: item.material.calcEffect(item.itemType),
  };

  item.costs = {
    materials: item.material.calcCost ? item.material.calcCost(item.itemType) : 0,
    itemCost: item.itemType.cost,
    masterwork: item.isMasterwork ? item.effects.masterwork.cost : 0,
    enchantment: item.effects.enchantment.cost,
  };
  item.costs.total = Object.values(item.costs).reduce((acc,cur) => {
      if( !cur ) {
        return acc;
      }
      return acc + cur;
    }, 0);


  item.actions = [];
  if( item.itemType.actions ) {
    item.actions = item.actions.concat(item.itemType.actions);
  }

  // Every stat
  item.data = {};
  for( let field in item.itemType.data ) {
    item.data[field] = item.itemType.data[field];
  }
  const dataStats = [
    'ac',
    'cp',
    'attack',
    'damage',
  ];
  dataStats.forEach( stat => {
    item.data[stat] = {
      itemType: item.itemType.data[stat],
      enchantment: item.effects.enchantment[stat],
      masterwork: item.effects.masterwork[stat],
    };
    item.data[stat].total = Object.values(item.data[stat]).reduce((acc,cur) => {
      if( !cur ) {
        return acc;
      }
      return acc + cur;
    }, 0);
  });

  return {
    name: (item.enchantment ? `+${item.enchantment} ` : '') + item.itemType.name,
    itemType: item.itemType,
    material: item.material,
    category: item.category,
    count: item.count ? item.count : 1,
    costs: item.costs,
    actions: item.actions,
    data: item.data,
  };
};

export const getItems = (items) => {
  return items.map(getItem);
};
