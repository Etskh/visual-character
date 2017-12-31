import {
  ATTACK_DICE,
  DAMAGE_TYPES,
  AMMO_TYPES,
} from './constants';
import { checkDataAgainstRules } from './core';


export const itemCategories = [{
  name: 'wealth',
  slot: null,
}, {
  name: 'ammunition',
  slot: null,
}, {
  name: 'weapon',
  slot: 'main-hand',
  dataRules: {
    'hitpoints': {
      optional: 'number',
    },
    'isMasterwork': {
      optional: 'boolean',
    },
    'bonus': {
      optional: 'number',
      needs: 'isMasterwork',
    },
  },
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
  dataGetter: (item, itemType) => {
    const data = {};
    if( item.data.isMasterwork ) {
      data['masterwork'] = {
        cost: 300,
        attack: 1,
      };
    }

    return data;
  },
  /*
  enchantmentEffect: (type, bonus) => {
    return {
      attack: bonus - 1,
      damage: bonus,
    };
  },
  */
}, {
  name: 'armour',
  craftSkill: 'armour',
  slot: 'torso',
  dataRules: {
    'hitpoints': {
      optional: 'number',
    },
    'isMasterwork': {
      optional: 'boolean',
    },
    'bonus': {
      optional: 'number',
      needs: 'isMasterwork',
    },
  },
  typeRules: {
    'weight': [
      'light',
      'medium',
      'heavy',
    ],
    'ac': 'number',
    'check_penalty': 'number',
    'max_dex': 'number',
  },
  dataGetter: (item) => {
    const data = {};
    if( item.data.isMasterwork ) {
      data['masterwork'] = {
        cost: 150,
        check_penalty: 1,
      };
    }

    return data;
  },
  /*
  enchantmentEffect: (type, bonus) => {
    return {
      cost: Math.pow(bonus,2) * 1000,
      ac: bonus,
    }
  },
  */
}, {
  name: 'shield',
  craftSkill: 'armour',
  slot: 'off-hand',
  dataRules: {
    'hitpoints': {
      optional: 'number',
    },
    'isMasterwork': {
      optional: 'boolean',
    },
    'bonus': {
      optional: 'number',
      needs: 'isMasterwork',
    },
  },
  typeRules: {
    'weight': [
      'light',
      'heavy'
    ],
    'ac': 'number',
    'check_penalty': 'number',
  },
  dataGetter: (item) => {
    const data = {};
    if( item.data.isMasterwork ) {
      data['masterwork'] = {
        cost: 150,
        check_penalty: 1,
      };
    }

    return data;
  },
}, {
  name: 'boots',
  slot: 'feet',
}, {
  name: 'spellbook',
  typeRules: {
    pages: 'number',
  },
  dataRules: {
    pages: 'array',
  },
}];


export const materialTypes = [{
  name: 'any',
}, {
  name: 'metal',
}, {
  name: 'fabric',
}, {
  name: 'wood',
}, {
  name: 'paper',
}, {
  name: 'precious metals'
}];

/*
2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199
*/
const GEMSTONES = {
  // Low quality 10 - 50
  'agate': 11,
  'azurite': 13,
  'blue quartz': 17,
  'hematite': 23,
  'malachite': 29,
  'obsidian': 31,
  'tigereye': 37,
  // semi-precious  50 - 100
  'bloodstone': 53,
  'jasper': 61,
  'moonstone': 79,
  'onyx': 89,
  // medium qality
  'amethyst': 101,
  'red garnet': 103,
  'green garnet': 107,
  'jade': 127,
  // gemstones 500
  'golden topaz': 503,
  // jewels
  'emerald': 1031,
  'fire opal': 2017,
  //'blue sapphire': 3077,
};

export const itemTypes = [{
  name: 'fullplate',
  weight: 50,
  cost: 1200,
  category: 'armour',
  defaultMaterial: 'steel',
  data: {
    weight: 'heavy',
    ac: 9,
    check_penalty: -6,
    max_dex: 1,
  },
}, {
  name: 'chainmail',
  weight: 20,
  cost: 600,
  category: 'armour',
  defaultMaterial: 'steel',
  data: {
    weight: 'medium',
    ac: 6,
    check_penalty: -3,
    max_dex: 3,
  },
}, {
  name: 'heavy metal shield',
  weight: 15,
  cost: 20,
  category: 'shield',
  defaultMaterial: 'steel',
  data: {
    weight: 'heavy',
    ac: 2,
    check_penalty: -2,
  },
}, {
  name: 'morningstar',
  weight: 8,
  cost: 8,
  category: 'weapon',
  defaultMaterial: 'steel',
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
  defaultMaterial: 'wood',
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
  defaultMaterial: 'wood',
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
  defaultMaterial: 'cloth',
}, {
  name: 'bolt',
  category: 'ammunition',
  cost: 0.1,
  weight: 0.1,
  defaultMaterial: 'wood',
  data: {
    // empty
  },
}, {
  name: 'arrow',
  category: 'ammunition',
  cost: 0.05,
  weight: 3 / 20,
  defaultMaterial: 'wood',
  data: {
    // empty
  },
}, {
  name: 'spellbook',
  category: 'spellbook',
  cost: 15,
  weight: 3,
  defaultMaterial: 'paper',
  data: {
    pages: 100,
  },
}, {
  name: 'gold piece',
  category: 'wealth',
  cost: 1,
  weight: 0.01,
  defaultMaterial: 'gold',
}, {
  name: 'silver piece',
  category: 'wealth',
  cost: 0.1,
  weight: 0.01,
  // TODO: make it not gold
  defaultMaterial: 'gold',
}, {
  name: 'copper piece',
  category: 'wealth',
  cost: 0.01,
  weight: 0.01,
  // TODO: make it not gold
  defaultMaterial: 'gold',
}].concat(Object.keys(GEMSTONES).map( gem => {
  return {
    name: `${gem} gem`,
    category: 'wealth',
    cost: GEMSTONES[gem],
    weight: 0.1,
    // TODO: make it not gold - make it 'gem'
    defaultMaterial: 'gold',
  };
}));




export const materials = [{
  name: 'cloth',
  type: 'fabric',
  hp: 1,
  hardness: 0,
}, {
  name: 'paper',
  type: 'paper',
  hp: 2,
  hardness: 0,
}, {
  name: 'wood',
  type: 'wood',
  hp: 10,
  hardness: 5,
}, {
  name: 'steel',
  type: 'metal',
  hp: 10,
  hardness: 30,
}, {
  name: 'gold',
  type: 'precious metals',
  hp: 5,
  hardness: 10,
}, {
  name: 'mithral',
  type: 'metal',
  hp: 30,
  hardness: 15,
  dataGetter: (item, itemType) => {
    const getCost = () => {
      if( itemType.category === 'armour') {
        switch( itemType.data.weight ) {
        case 'light':
          return 1000 - 150;
        case 'medium':
          return 4000 - 150;
        case 'heavy':
          return 9000 - 150;
        default:
          console.error(`Unknown armour type ${itemType.name}`);
        }
      }

      if( itemType.category === 'shield' ) {
        return 1000 - 150;
      }

      return itemType.weight * 500 - 300;
    }

    return {
      mithral: {
        cost: getCost(),
        scale_weight: 0.5,
      },
    };
  },
}];


export const getItem = (item) => {
  checkDataAgainstRules(item, {
    itemType: itemTypes.map( type => type.name ),
    material: {
      optional: materials.map( mat => mat.name )
    },
    count: {
      optional: 'number',
    },
    data: 'ignore',
  });

  // Get parent objects for the object
  const itemType = itemTypes.find(t => t.name === item.itemType );
  const material = materials.find(m => {
    return m.name === (item.material ? item.material : itemType.defaultMaterial );
  });
  const category = itemCategories.find(c => c.name === itemType.category );

  // If item data doesn't exist, initialize it!
  item.data = item.data ? item.data : {};

  // What are the effects
  // Set all the data in each type of item
  const data = {};
  const dataStats = [
    'ac',
    'check_penalty',
    'attack',
    'damage',
    'max_dex',
    'cost',
    'scale_weight',
  ];
  const dataSources = [
    category,
    itemType,
    material,
  ];
  dataStats.forEach( stat => {
    data[stat] = {
      // start empty for everything
    };
  });

  // For all the sources, add up the data
  dataSources.forEach( source => {
    if( source.dataGetter ) {
      let sourceData = source.dataGetter(item, itemType, category);
      Object.keys(sourceData).forEach( sourceName => {
        dataStats.forEach( stat => {
          // if material.mithral.cost
          //   data.cost.mithral = material.mithral.cost
          if( sourceData[sourceName][stat] ) {
            data[stat][sourceName] = sourceData[sourceName][stat];
          }
        });
      });
    }

    // Now for each data stat, just add it
    dataStats.forEach( stat => {
      if( source.data && source.data[stat] ) {
        data[stat][source.name] = source.data[stat];
      }
    });
  });

  // Add the base cost of the item
  data.cost[itemType.name] = itemType.cost;

  // Total all the data keys
  Object.keys(data).forEach(field => {
    data[field].total = Object.keys(data[field]).reduce((acc, cur) => {
      if( cur === 'total') {
        return acc;
      }
      return acc + data[field][cur];
    }, 0);
  });

  // Create the item
  const returnedItem = {
    name: itemType.name,
    itemType: itemType,
    material: material,
    category: category,
    weight: itemType.weight * (data.scale_weight.total ? data.scale_weight.total : 1),
    count: item.count ? item.count : 1,
    //actions: [],
    data: data,
  };

  return returnedItem;
};

export const getItems = (items) => {
  return items.map(getItem);
};

export const getItemsWorth = (cost) => {
  const wealthItemTypes = itemTypes.filter(type => type.category === 'wealth');

  // Get the most valuable item for how much cost we have
  const mostValuableReducer = (highestCost) => {
    return (acc, cur) => {
      if( !acc ) {
        return cur;
      }
      if ( acc.cost > highestCost ) {
        return cur;
      }
      if ( cur.cost < highestCost && cur.cost > acc.cost ) {
        return cur;
      }
      return acc;
    };
  };
  const items = [];

  let costToGo = cost;
  let maxruns = wealthItemTypes.length; // failsafe
  while( costToGo > 0.01 ) {
    const valuable = wealthItemTypes.reduce(mostValuableReducer(costToGo), null);
    const howMany = parseInt(costToGo / valuable.cost);
    //console.log(`${howMany} ${valuable.name}s fit into ${costToGo}gp`);
    costToGo -= (valuable.cost * howMany) - 0.0001;
    if( howMany > 0.01 ) {
      items.push({
        itemType: valuable.name,
        count: howMany,
      });
    }
    if( --maxruns < 0 ) break; // failsafe
  }

  return items;
};


export const getRandomItemsWorth = (cost) => {
  const split = Math.random();
  const items = [];
  [
    cost * split,
    (1 - split) * cost,
  ].forEach( costToGo => {
    const itemsWorth = getItemsWorth(costToGo);
    itemsWorth.forEach( item => {
      // Find if it already exists, and if not, add it!
      const existingItem = items.find(i => item.itemType === i.itemType );
      if( existingItem ) {
        existingItem.count += item.count;
      }
      else {
        items.push(item);
      }
    });
  });

  //console.log(JSON.stringify(items));

  return items;
}
