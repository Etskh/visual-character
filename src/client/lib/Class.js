
// Playstle
const ADAPTABLE = 'ADAPTABLE';
const BOLD = 'BOLD';
const THOUGHTFUL = 'THOUGHTFUL';
// Caster
const NO = 'NO';
const WEAK = 'WEAK';
const STRONG = 'STRONG';
// melee
const YES = 'YES';
// const NO = 'NO'; already exists
const MAYBE = 'MAYBE';


const classes = [{
  id: 1,
  name: 'barbarian',
  bab_growth: 'fast',
  fort_save_growth: 'good',
  ref_save_growth: 'bad',
  will_save_growth: 'bad',
  hitdice: 12,
  skill_points: 4,
  features: [],
  info: {
    description: 'Intimidate! Instigate! Crush! Charge! Rally! RAGE! Repeat.',
    playstyle: BOLD,
    caster: NO,
    melee: YES,
  },
}, {
  id: 2,
  name: 'bard',
  bab_growth: 'average',
  fort_save_growth: 'bad',
  ref_save_growth: 'good',
  will_save_growth: 'good',
  hitdice: 8,
  skill_points: 6,
  features: [],
  info: {
    description: 'Using music to bolster his allies, bards are the diplomats and charming seducers of their group',
    playstyle: ADAPTABLE,
    caster: WEAK,
    melee: MAYBE,
  },
}, {
  id: 3,
  name: 'cleric',
  bab_growth: 'average',
  fort_save_growth: 'good',
  ref_save_growth: 'bad',
  will_save_growth: 'good',
  hitdice: 8,
  skill_points: 2,
  features: [],
  info: {
    description: 'Clerics follow a noble cause, with their domain god granting them divine power',
    playstyle: BOLD,
    caster: STRONG,
    melee: YES,
  },
}, {
  id: 4,
  name: 'druid',
  bab_growth: 'average',
  fort_save_growth: 'good',
  ref_save_growth: 'bad',
  will_save_growth: 'good',
  hitdice: 8,
  skill_points: 4,
  features: [],
  info: {
    description: 'The powers of nature are the strongest of all. The druid heeds to nature\'s command and is an avatar of its fury',
    playstyle: ADAPTABLE,
    caster: STRONG,
    melee: MAYBE,
  },
}, {
  id: 5,
  name: 'fighter',
  bab_growth: 'fast',
  fort_save_growth: 'good',
  ref_save_growth: 'bad',
  will_save_growth: 'bad',
  hitdice: 10,
  skill_points: 2,
  features: [],
  info: {
    description: 'Adeptly trained with weapons, they command the battlefield with a slew of feats to pick from.',
    playstyle: ADAPTABLE,
    caster: NO,
    melee: YES,
  },
}, {
  id: 6,
  name: 'monk',
  bab_growth: 'average',
  fort_save_growth: 'good',
  ref_save_growth: 'good',
  will_save_growth: 'good',
  hitdice: 8,
  skill_points: 4,
  features: [{
    level: 1,
    choices: [],
  }],
  info: {
    description: 'The aesectic lifestyle of the monk grants them powers they unlock through training; unarmed and unarmoured, but fearsome to meddle with.',
    playstyle: BOLD,
    caster: NO,
    melee: YES,
  },
}, {
  id: 7,
  name: 'paladin',
  bab_growth: 'fast',
  fort_save_growth: 'good',
  ref_save_growth: 'bad',
  will_save_growth: 'good',
  hitdice: 8,
  skill_points: 2,
  features: [],
  info: {
    description: 'Paladins are holy warriors of the law and good of the world by smiting evil from it',
    playstyle: BOLD,
    caster: WEAK,
    melee: YES,
  },
}, {
  id: 8,
  name: 'ranger',
  bab_growth: 'fast',
  fort_save_growth: 'good',
  ref_save_growth: 'good',
  will_save_growth: 'bad',
  hitdice: 10,
  skill_points: 6,
  features: [],
  info: {
    description: 'Hunter, explorer, warrior, wanderer; a ranger knows the lay of the land, and specialises in either two-weapon fighting, or using the bow',
    playstyle: THOUGHTFUL,
    caster: WEAK,
    melee: MAYBE,
  },
}, {
  id: 9,
  name: 'rogue',
  bab_growth: 'average',
  fort_save_growth: 'bad',
  ref_save_growth: 'good',
  will_save_growth: 'bad',
  hitdice: 8,
  skill_points: 8,
  features: [],
  info: {
    description: 'Silver-toungued trickster, or deadly assassin; a rogue can be one of many things',
    playstyle: THOUGHTFUL,
    caster: NO,
    melee: MAYBE,
  },
}, {
  id: 10,
  name: 'sorcerer',
  bab_growth: 'slow',
  fort_save_growth: 'bad',
  ref_save_growth: 'bad',
  will_save_growth: 'good',
  hitdice: 6,
  skill_points: 2,
  features: [],
  info: {
    description: 'The innate arcane power inside sorcerers allow them to channel devestating magical forces',
    playstyle: BOLD,
    caster: STRONG,
    melee: NO,
  },
}, {
  id: 11,
  name: 'wizard',
  bab_growth: 'slow',
  fort_save_growth: 'bad',
  ref_save_growth: 'bad',
  will_save_growth: 'good',
  hitdice: 6,
  skill_points: 2,
  features: [],
  info: {
    description: 'Years of study allows the wizard to unlock the mysteries of the arcane to an immense magnitude',
    playstyle: THOUGHTFUL,
    caster: STRONG,
    melee: NO,
  },
}];


export default class Class {
  static load(name) {
    const cls = classes.find(c => c.name === name);
    if (!cls) {
      return Promise.reject(new Error(`No known class with name ${name}`));
    }

    return Promise.resolve(cls);
  }

  static all() {
    return Promise.resolve(classes);
  }
}
