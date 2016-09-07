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
  'slots': {
    // nothing equipped or held!
  },
  'equipment': [{
    'id': 1,
    'equipment': 'dagger',
    'count': 1,
    'material': 'silver',
    'properties': [
      'masterwork',
    ],
  }, {
    'id': 2,
    'equipment': 'dagger',
    'count': 2,
  }, {
    'id': 3,
    'equipment': 'light crossbow',
    'count': 1,
  }, {
    'id': 4,
    'equipment': 'quiver',
    'count': 1,
  }, {
    'id': 5,
    'equipment': 'bolt',
    'count': 10,
  }, {
    'id': 6,
    'equipment': 'rope (hemp)',
    'count': 1,
  }, {
    'id': 7,
    'equipment': 'spellbook',
    'count': 1,
  }, {
    'id': 8,
    'equipment': 'bag of holding',
    'count': 1,
  }, {
    'id': 9,
    'equipment': 'copper piece',
    'count': 235,
  }, {
    'id': 10,
    'equipment': 'silver piece',
    'count': 905,
  }, {
    'id': 11,
    'equipment': 'gold piece',
    'count': 1200,
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
      'wis': -3,
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
  'slots': {
    // nothing equipped or held!
  },
  'equipment': [{
    'equipment': 'chain shirt',
    'count': 1,
    'id': 1,
  }, {
    'id': 2,
    'equipment': 'longsword',
    'count': 1,
  }, {
    'id': 3,
    'equipment': 'short sword',
    'count': 1,
    'properties': [
      'masterwork',
    ],
  }, {
    'id': 4,
    'equipment': 'dagger',
    'count': 30,
  }, {
    'id': 5,
    'equipment': 'arrow',
    'count': 20,
  }, {
    'id': 6,
    'equipment': 'longbow',
    'count': 1,
  }, {
    'id': 7,
    'equipment': 'quiver',
    'count': 1,
  }, {
    'id': 8,
    'equipment': 'copper piece',
    'count': 35,
  }, {
    'id': 9,
    'equipment': 'silver piece',
    'count': 125,
  }, {
    'id': 10,
    'equipment': 'gold piece',
    'count': 500,
  }],
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
