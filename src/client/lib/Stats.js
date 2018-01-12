import {
  STATS,
  SKILLS,
} from './constants';
import Race from './Race';

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
  }
};


STATS.forEach((stat) => {
  const statNames = {
    str: 'Strength',
    dex: 'Dexterity',
    con: 'Constitution',
    int: 'Intelligence',
    wis: 'Wisdom',
    cha: 'Charisma',
  };
  stats[stat] = {
    name: stat,
    fullname: statNames[stat],
    description: '[tbd]',
  };
  stats[`${stat}_mod`] = {
    name: `${stat} modifier`,
    alias: stat,
    fullname: `${statNames[stat]} modifier`,
    description: `You take a ${statNames[stat]}. You take a modifier. Ungh! ${statNames[stat]} modifier!`,
  };
});


[
  // TODO: Have the list of classes elsewhere
  'wizard',
].forEach((className) => {
  for (let level = 1; level < 20; level += 1) {
    stats[`level ${level} ${className}`] = {
      name: `${className} ${level}`,
      fullname: `Level ${level} ${className[0].toUpperCase() + className.substring(1)}`,
      description: 'After leveling up, your class will improve your Base attack bonus, fortitude save, reflex save, and will save.',
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
}
