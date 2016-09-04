'use strict'

module.exports = [{
  'name': 'dagger',
  'weight': 1.0,
  'cost': 200,
  'containers': [
    'belt',
    'boot'
  ],
  // It is a weapon if it has a weapon block
  'weapon': {
    'type': 'simple',
    'handedness': 'light',
    'attacks': [{
      'damage': {
        'die': 4,
        'count': 1,
        'type': [
          'piercing',
          'slashing',
        ],
      },
      'range': false,
      'critical': {
        'range': 2,
        'multiplier': 2,
      },
    },{
      'damage': {
        'die': 4,
        'count': 1,
        'type': 'piercing',
      },
      'range': {
        'type': 'thrown',
        'increment': 10,
      },
      'critical': {
        'range': 2,
        'multiplier': 2,
      },
    }],
  }
}, {
  'name': 'spellbook',
  'weight': 1.0,
  'cost': 7.5,
  'containers': [
    'belt',
    'bag'
  ],
}, {
  'name': 'rope (hemp)',
  'weight': 5.0,
  'cost': 1000,
  'containers': [
    'bag'
  ],
}, {
  'name': 'light crossbow',
  'weight': 4.0,
  'cost': 3500,
  'containers': [
    'bag',
    'back'
  ],
  // It is a weapon if it has a weapon block
  'weapon': {
    'type': 'simple',
    'handedness': 'two',
    'attacks': [{
      'damage': {
        'die': 8,
        'count': 1,
        'type': [
          'piercing'
        ],
      },
      'range': {
        'type': 'bolt',
        'increment': 80
      },
      'critical': {
        'range': 2,
        'multiplier': 2,
      },
    }],
  }
}, {
  'name': 'bolt',
  'weight': 0.1,
  'cost': 10,
  'containers': [
    'quiver'
  ],
  // A crossbow bolt can be used as an improvised piercing
  // weapon
  'weapon': {
    'type': 'imporovised',
    'handedness': 'light',
    'attacks': [{
      'damage': {
        'die': 4,
        'count': 1,
        'type': [
          'piercing'
        ],
      },
      'range': false,
      'critical': {
        'range': 2,
        'multiplier': 2,
      },
    }],
  }
}, {
  'name': 'quiver',
  'weight': 0.1,
  'cost': 1,
  'max_weight': 1,
}, {
  'name': 'spellbook',
  'weight': 1,
  'cost': 75,
  'spellbook': {
    'pages': 100,
  }
}, {
  'name': 'rope (hemp)',
  'weight': 5,
  'cost': 1000,
}, {
  'name': 'bag of holding',
  'weight': 25,
  'cost': 10000,
}, {
  'name': 'chain shirt',
  'weight': 25,
  'cost': 10000,
  'armour': {
    'ac_bonus': 4,
    'max_dex': 4,
    'check_penalty': -2,
    'arcane_spell_failure': 0.20,
    'speed': 'reduced',
    'type': 'light',
  },
}, {
  'name': 'longsword',
  'weight': 4,
  'cost': 1500,
  'weapon': {
    'type': 'martial',
    'handedness': 'one',
    'attacks': [{
      'damage': {
        'die': 8,
        'count': 1,
        'type': [
          'slashing'
        ],
      },
      'range': false,
      'critical': {
        'range': 2,
        'multiplier': 2,
      },
    }],
  },
}, {
  'name': 'short sword',
  'weight': 2,
  'cost': 1000,
  'weapon': {
    'type': 'martial',
    'handedness': 'light',
    'attacks': [{
      'damage': {
        'die': 6,
        'count': 1,
        'type': [
          'piercing'
        ],
      },
      'range': false,
      'critical': {
        'range': 2,
        'multiplier': 2,
      },
    }],
  },
}, {
  'name': 'longbow',
  'weight': 3,
  'cost': 7500,
  'weapon': {
    'type': 'martial',
    'handedness': 'two',
    'attacks': [{
      'damage': {
        'die': 8,
        'count': 1,
        'type': [
          'piercing'
        ],
      },
      'range': {
        'increment': 100,
        'type': 'arrow',
      },
      'critical': {
        'range': 1,
        'multiplier': 3,
      },
    }],
  },
}, {
  'name': 'arrow',
  'weight': 0.15,
  'cost': 5,
}, {
  'name': 'copper piece',
  'weight': 0.02,
  'cost': 1,
}, {
  'name': 'silver piece',
  'weight': 0.02,
  'cost': 10,
}, {
  'name': 'gold piece',
  'weight': 0.02,
  'cost': 100,
}, {
  'name': 'platinum piece',
  'weight': 0.02,
  'cost': 1000,
}]
