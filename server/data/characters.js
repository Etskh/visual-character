'use strict'

module.exports = [{
  'id': 1,
  'name': 'Pig',
  'race': 'Goblin',
  'classes': {
    'Wizard': 4
  },
  'skill_ranks': {
    'linguistics': 3,
    'spellcraft': 4,
    'knowledge': {
      'arcana': 4,
    },
  },
  // Which is the dominant hand
  'handedness': 'right',
  // an array where 0 is main and 1 is right, etc.
  'slots': {
    // nothing equipped or held!
  },
  'equipment': [{
    'equipment': 'dagger',
    'count': 1,
    'material': 'silver',
    'properties': [
      'masterwork',
    ],
  }, {
    'equipment': 'dagger',
    'count': 2,
  }, {
    'equipment': 'light crossbow',
    'count': 1,
  }, {
    'equipment': 'quiver',
    'count': 1,
  }, {
    'equipment': 'bolt',
    'count': 10
  }, {
    'equipment': 'rope (hemp)',
    'count': 1
  }, {
    'equipment': 'spellbook',
    'count': 1,
    'spells': {

    }
  }, {
   'equipment': 'bag of holding',
   'count': 1
  }],
  'height': 2.9,
  'weight': 40.0,
  'stats': {
    'str': 9,
    'dex': 17,
    'con': 12,
    'int': 18,
    'wis': 13,
    'cha': 9
  },
  'enchantments': [{
    'name': 'Wisdom drain',
    'since': 50,
    'duration': 20,
    'effects': {
      'stats.wisdom': -3,
    },
  }], // enchantments
}, {
  'id': 2,
  'name': 'Kazrah',
  'race': 'Half-orc',
  'classes': {
    'Ranger': 4
  },
  'skill_ranks': {
  },
  // Which is the dominant hand
  'handedness': 'right',
  // an array where 0 is main and 1 is right, etc.
  'slots': {
    // nothing equipped or held!
  },
  'equipment': [],
  'height': 6.2,
  'weight': 210.0,
  'stats': {
    'str': 16,
    'dex': 15,
    'con': 12,
    'int': 10,
    'wis': 14,
    'cha': 12
  },
  'enchantments': [],
}]
