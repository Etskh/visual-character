



export const ATTACK_DICE = [
  '1',
  '1d2',
  '1d3',
  '1d4',
  '1d6',
  '1d8',
  '2d4',
  '1d10',
  '2d6',
  '1d12',
  '2d8',
  '3d4',
  '2d10',
  '3d6',
];
export const DAMAGE_TYPES = [
  'b',
  's',
  'p',
  's/p',
  'b/p',
];
const CRAFT_SKILLS = [
  'alchemy',
  'armour',
  'bows',
  'weapons',
  'traps',
];
export const AMMO_TYPES = [
  'arrow',
  'self',
  'bolt',
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
  // ... TODO: etc.
];

export const CHOICE_TYPES = [
  'race',
  'class',
  'feat',
  'hitpoints',
  'skill',
  'str',
  'dex',
  'con',
  'int',
  'wis',
  'cha',
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
  }],
}, {
  name: 'climb',
  stat: 'str',
  hasCheckPenalty: true,
}, {
  name: 'knowledge (arcana)',
  stat: 'int',
}, {
  name: 'perception',
  stat: 'wis',
  actions: [{
    name: 'Perception',
    when: 'world',
    type: 'audio/visual',
    description: 'Perceive the area with your eyes; try to spot anomalies.',
  }],
}, {
  name: 'sense motive',
  stat: 'wis',
  actions: [{
    name: 'Sense Motive',
    when: 'world',
    type: 'conversation',
    description: 'Discern lies from the interactions you have with other characters',
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
  sizeTranslator: size => (size * -4),
  stat: 'dex',
  hasCheckPenalty: true,
  actions: [{
    name: 'Sneak',
    when: 'combat',
    type: 'move',
    description: '',
    data: {
      move_speed_ratio: 0.5,
    },
  }],
}];


export const ENCUMBRANCE = [{
  name: 'Light',
  light_load_min: 0,
  light_load_max: 1,
  effect: null, // no effect when light
}, {
  name: 'Medium',
  light_load_min: 1,
  light_load_max: 2,
  effect: {
    name: 'Medium encumbrance',
    // effect stuff
  },
}, {
  name: 'Heavy',
  light_load_min: 2,
  light_load_max: 3,
  effect: {
    name: 'Heavy encumbrance',
    // effect stuff
  },
}, {
  name: 'Staggering',
  light_load_min: 3,
  light_load_max: 6, // up to double max-load
}, {
  name: 'Unbearable',
  light_load_min: 6,
}];
export const getEncumbranceBracket = (weight, lightLoad) => {
  const weightScale = weight / lightLoad;
  return ENCUMBRANCE.reduce((acc, cur) => {
    if (weightScale > cur.light_load_min) {
      if (cur.light_load_max && cur.light_load_max > weightScale) {
        return cur;
      }
    }
    return acc;
  }, null);
};


export const CHARACTER_DATA =
  // str, dex, etc
  // and str_mod, dex_mod, etc.
  STATS.concat(STATS.map(stat => `${stat}_mod`)).concat([
    'size',
    'total_hp',
    'check_penalty',
    'ac',
    'ac_flatfooted',
    'ac_touch',
    'bab',
    'level',
    'fort_save',
    'ref_save',
    'will_save',
    'light_load',
    'current_load',
  ]).concat(SKILLS.map(skill => `skill_${skill.name}`));