
function diceGetter() {
  const dice = [];
  const diceSides = [
    4, 6, 8, 10, 12, 20,
  ];

  for (let count = 1; count < 4; count += 1) {
    for (let sides = 0; sides < diceSides.length; sides += 1) {
      dice.push({ count, sides: diceSides[sides] });
    }
  }
  dice.sort((a, b) => (a.count * a.sides) - (b.count * b.sides));
  return [
    '1',
    '1d2',
    '1d3',
  ].concat(dice.map(d => `${d.count}d${d.sides}`));
}

/*
  1,
  1d2,
  1d3,
  1d4,
  1d6,
  1d8,
  ...
  2d12,
  3d8,
  3d10,
  ...
  3d20
*/
export const ATTACK_DICE = diceGetter();

export const DAMAGE_TYPES = [
  'b',
  's',
  'p',
  's/p',
  'b/p',
];
export const CRAFT_SKILLS = [
  'alchemy',
  'armour',
  'bows',
  'weapons',
  'traps',
];
export const AMMO_TYPES = [
  'arrow',
  'bolt',
  'self', // for thrown
];

export const STATS = [
  'str',
  'dex',
  'con',
  'int',
  'wis',
  'cha',
];

export const SLOTS = [
  'main-hand',
  'off-hand',
  'torso',
  'feet',
  // ... TODO: etc.
];

export const CHOICE_TYPES = [
  'race',
  'class',
  'feat',
  'hitpoints',
  'skill',
  'base_stat',
];

export const CHOICE_REASONS = [
  'level 1',
  'level 2',
  'level 3',
];


export const SKILLS = [{
  name: 'bluff',
  stat: 'cha',
  actions: [{
    name: 'Deceive',
    when: 'world',
    type: 'conversation',
    description: 'Lie to somebody.',
    blocks: [{
      type: 'roll',
      comparison: 'against',
      target: 'sense motive',
      isTargetSecret: true,
    }, {
      type: 'success',
      text: 'You lie successfully... you presume',
    }, {
      type: 'failure',
      text: 'They see through your charade',
    }],
  }],
}, {
  name: 'climb',
  stat: 'str',
  hasCheckPenalty: true,
}, {
  name: 'knowledge (arcana)',
  stat: 'int',
}, {
  name: 'knowledge (dungeoneering)',
  stat: 'int',
}, {
  name: 'knowledge (geography)',
  stat: 'int',
}, {
  name: 'knowledge (nature)',
  stat: 'int',
}, {
  name: 'perception',
  stat: 'wis',
  actions: [{
    name: 'Look / Listen',
    when: 'world',
    type: 'reaction',
    description: 'Perceive the area with your eyes and ears.',
  }],
}, {
  name: 'sense motive',
  stat: 'wis',
  actions: [{
    name: 'Sense Motive',
    when: 'world',
    type: 'reaction',
    description: 'Discern lies from the interactions you have with other characters',
    blocks: [{
      type: 'roll',
      comparison: 'against',
      target: 'bluff',
      isTargetSecret: true,
    }, {
      type: 'success',
      text: 'You see through their deceit',
    }, {
      type: 'failure',
      text: 'They must not be lying to you',
    }],
  }],
}, {
  name: 'spellcraft',
  stat: 'int',
  actions: [{
    name: 'Discern Spell',
    when: 'combat',
    type: 'reaction',
    description: 'Discern spell',
  }],
}, {
  name: 'stealth',
  stat: 'dex',
  hasCheckPenalty: true,
  actions: [{
    name: 'Sneak',
    when: 'combat',
    duration: 'move',
    type: 'move',
    description: 'Move undetected around a battle field',
    data: {
      move_speed_ratio: 0.5,
    },
    blocks: [{
      type: 'roll',
      comparison: 'against',
      target: 'perception',
      isTargetSecret: true,
    }, {
      type: 'success',
      text: 'You meld into the shadows and move half your move speed',
    }, {
      type: 'failure',
      text: 'You still move half your speed, but you aren\'t moving as clandestinely as you think you are.',
    }],
  }],
}];


export const ENCUMBRANCE = [{
  name: 'None',
  light_load_min: 0,
  light_load_max: 1,
  effect: null, // no effect when light
}, {
  name: 'Medium',
  light_load_min: 1,
  light_load_max: 2,
  effect: {
    name: 'Medium encumbrance',
    data: {
      max_dex: 3,
      check_penalty: -3,
      move_speed_ratio: 0.6,
    },
  },
}, {
  name: 'Heavy',
  light_load_min: 2,
  light_load_max: 3,
  effect: {
    name: 'Heavy encumbrance',
    data: {
      max_dex: 1,
      check_penalty: -6,
      move_speed_ratio: 0.6,
      run_multiplier: 3,
    },
  },
}, {
  name: 'Staggering',
  light_load_min: 3,
  light_load_max: 6, // up to double max-load
  effect: {
    name: 'Staggered',
    data: {
      max_dex: 0,
      check_penalty: -20,
      move_speed_ratio: 0.1,
      run_multiplier: 0,
    },
  },
}, {
  name: 'Unbearable',
  light_load_min: 6,
  effect: {
    name: 'Immobile',
    data: {
      max_dex: 0,
      check_penalty: -20,
      move_speed_ratio: 0,
      run_multiplier: 0,
    },
  },
}];
export const getEncumbranceBracket = (weight, lightLoad) => {
  const weightScale = weight / lightLoad;
  return ENCUMBRANCE.reduce((acc, cur) => {
    if (weightScale >= cur.light_load_min) {
      if (cur.light_load_max && cur.light_load_max > weightScale) {
        return cur;
      }
    }
    return acc;
  }, null);
};


export const getNextLevel = (currentLevel) => {
  const choices = [];
  // if the next level is odd, add a feat
  if ((currentLevel + 1) % 2 === 1) {
    choices.push({
      type: 'feat',
      decision: null,
      reason: `level ${currentLevel + 1}`,
    });
  }
  // If the next level is divisible by four, add a stat-point
  if ((currentLevel + 1) % 4 === 0) {
    choices.push({
      type: 'stat',
      decision: null,
      reason: `level ${currentLevel + 1}`,
    });
  }

  return {
    level: currentLevel + 1,
    exp: 2000, // TODO: fix this
    choices,
  };
};


export const STARTING_CHOICES = [{
  type: 'class',
  reason: 'new character',
  decision: null,
}, {
  type: 'race',
  reason: 'new character',
  decision: null,
}];
