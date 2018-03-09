import {
  STATS,
  SKILLS,
} from './constants';
import Race from './Race';

/*
stat: {
  name: Short-hand name, appears on buttons
  fullname: long-form name, appears in title bar
  description: 'text', what it is; how to get more.
  alias (optional): when it's clicked on, it redirects to alias instead
  stat (generated): the key for the object eg:( ac: { name: 'AC', stat: 'ac' })
}
*/

const stats = {
  base: {
    name: 'base',
    fullname: 'base',
  },
  ac: {
    name: 'AC',
    fullname: 'Armour class',
    description: 'The defences you have against physical attacks. A higher armour class helps avoid attacks completely. You can raise your armour class by wearing armour (if you are proficient), by being dexterous, or through magic.',
  },
  str_from_size: {
    name: 'Str from size',
    fullname: 'Strength from size',
    alias: 'size',
  },
  dex_from_size: {
    name: 'Dex from size',
    fullname: 'Dexterity from size',
    alias: 'size',
  },
  skill_stealth_from_size: {
    name: 'Size',
    fullname: 'Size',
    alias: 'size',
  },
  ac_from_size: {
    name: 'Size',
    fullname: 'Size',
    alias: 'size',
  },
  attack_from_size: {
    name: 'Size',
    fullname: 'Size',
    alias: 'size',
  },
  check_penalty: {
    name: 'CP',
    fullname: 'Check penalty',
    description: '[tbd]',
  },
  size: {
    name: 'Size',
    fullname: 'Size modifier',
    description: 'Smaller and larger creatures are better, or worse, at certain tasks. Smaller creatures will be harder to hit, and harder to spot when they hide. Larger creatures, on the other hand will be better at bullying smaller creatures.',
    hideFields: true,
  },
  fort_save: {
    name: 'Fort',
    fullname: 'Fortitude save',
    description: '[tbd]',
  },
  ref_save: {
    name: 'Ref',
    fullname: 'Reflex save',
    description: '[tbd]',
  },
  will_save: {
    name: 'Will',
    fullname: 'Will save',
    description: '[tbd]',
  },
  points: {
    name: 'Skill points',
    fullname: 'Skill points',
  },
  base_stat: {
    name: 'Base',
    fullname: 'Base',
  },
  bab: {
    name: 'BAB',
    fullname: 'Base Attack Bonus',
    description: 'Almost every time you level up in a class, it will increase your base attack bonus. More physical classes like fighters will have a higher base attack bonus than that of a spellcaster of the same level.',
  },
  ranged_main_attack: {
    name: 'Ranged attack',
    fullname: 'Ranged main-hand attack',
    description: 'main-hand', // TODO: load in the description for the item because the decsription is 'main-hand'
  },
  attack: {
    name: 'Attack',
    fullname: 'Attack',
    // TODO: make "attack" as a bonus no longer exist, and add size to both ranged
    // and melee attack individually.
    description: 'Bonuses for attacking, such as size, or if the weapon in your hand is enchanted.',
  },
};


STATS.forEach((stat) => {
  const statDescriptions = {
    str: {
      name: 'Strength',
      what: 'sheer muscle, and raw physical power',
      affects: 'melee attacks, and carrying capacity',
      important: 'engage in melee combat and whose main tool is lifting, shoving, or hauling.',
    },
    dex: {
      name: 'Dexterity',
      what: 'hand-eye coordination and nimbleness',
      affects: 'avoiding attacks, ranged attacks, and reflex saves',
      important: 'light characters who can\'t wear heavier armour, and for characters who rely on shooting from a distance',
    },
    con: {
      name: 'Constitution',
      what: 'tenacity and hardiness',
      affects: 'hitpoints, and fortitude saves',
      important: 'characters who are in the midst of combat and need physical reinforcement',
    },
    int: {
      name: 'Intelligence',
      what: 'memory and knowledge',
      affects: 'skill points, languages learned, knowledge checks',
      important: 'spellcasters whose power comes from a deep knowledge base, and characters who rely on skill checks',
    },
    wis: {
      name: 'Wisdom',
      what: 'acuity and insight',
      affects: 'perception checks, sensing people\'s motives, and willpower saves',
      important: 'casting spells whose power is granted by a higher power, and characters who rely on their wisdom',
    },
    cha: {
      name: 'Charisma',
      what: 'innate charm, wit, and knowledge of self',
      affects: 'diplomatic skills, general leadership',
      important: 'casting spells whose power is internal to the caster',
    },
  };
  stats[stat] = {
    name: stat,
    fullname: statDescriptions[stat].name,
    description: `${statDescriptions[stat].name} measures ${statDescriptions[stat].what}. It directly affects ${statDescriptions[stat].affects}. It is crucial for ${statDescriptions[stat].important}`,
  };
  stats[`${stat}_mod`] = {
    name: `${stat} modifier`,
    alias: stat,
    fullname: `${statDescriptions[stat].name} modifier`,
    description: `You take a ${statDescriptions[stat].name}. You take a modifier. Ungh! ${statDescriptions[stat].name} modifier!`,
  };
});


[
  // TODO: Have the list of classes elsewhere
  'barbarian',
  'bard',
  'cleric',
  'druid',
  'fighter',
  'monk',
  'paladin',
  'ranger',
  'rogue',
  'sorcerer',
  'wizard',
].forEach((className) => {
  for (let level = 1; level < 20; level += 1) {
    stats[`level ${level} ${className}`] = {
      name: `${className} ${level}`,
      fullname: `Level ${level} ${className[0].toUpperCase() + className.substring(1)}`,
      description: 'After leveling up, your class will improve your base attack bonus, fortitude save, reflex save, and will save.',
    };
  }
});


SKILLS.forEach((skill) => {
  stats[`skill_${skill.name}`] = {
    name: skill.name,
    fullname: skill.name,
    description: '[tbd]',
  };
});


Race.getStats().forEach((race) => {
  stats[race.name] = race;
  stats[race.name].hideFields = true;
});


export default class Stats {
  static get(key, data) {
    if (!stats[key]) {
      throw new Error(`Unknown stat ${key}`);
    }

    return Object.assign(stats[key], {
      data,
      stat: key,
    });
  }

  static getBaseDescriptions() {
    return STATS.map(stat => stats[stat]);
  }
}
