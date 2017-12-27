import {
  STATS,
  SKILLS,
} from './constants';
import Race from './Race';

const stats = {
  ac: {
    name: 'AC',
    fullname: 'Armour class',
    description: 'The defences you have against physical attacks. A higher armour class helps avoid attacks completely. You can raise your armour class by wearing armour (if you are proficient), by being dexterous, or through magic.',
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
    description: 'These are the points you can assin to each skill, individually. You gain new points at each level, at a rate based on the class you level into plus your intelligence modifier',
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
    fullname: stat,
    description: '[tbd]',
  };
  stats[`${stat}_mod`] = {
    name: `${stat} modifier`,
    fullname: `${statNames[stat]} modifier`,
    description: `You take a ${statNames[stat]}. You take a modifier. Ungh! ${statNames[stat]} modifier!`,
  };
});



[
  // Have the list of classes elsewhere
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


SKILLS.forEach( skill => {
  stats[`skill_${skill.name}`] = {
    name: skill.name,
    fullname: skill.name,
    description: '[tbd]',
  };
});


Race.getStats().forEach( race => {
  stats[race.name] = race;
});


export default stats;
