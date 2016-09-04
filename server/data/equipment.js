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
    'sub_type': 'simple',
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
    'sub_type': 'simple',
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
    }, {
      'handedness': 'light',
      'attack': -2,
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
    'sub_type': 'imporovised',
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
}]
