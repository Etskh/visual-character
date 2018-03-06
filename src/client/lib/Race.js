
const races = [{
  name: 'dwarf',
  description: '',
  stat_description: 'Dwarves are hardy and perceptive, but a bit standoffish.',
  data: {
    size: 0, // medium
    con: 2,
    wis: 2,
    cha: -2,
    skill_appraise: 2, // TODO: make this conditional for stone only... somehow
  },
}, {
  name: 'elf',
  description: '',
  stat_description: 'Elves are nimble and intelligent, but frail.',
  data: {
    size: 0,
    dex: 2,
    con: -2,
    int: 2,
    skill_perception: 2,
  },
}, {
  name: 'gnome',
  description: '',
  stat_description: 'Gnomes are hardy and charming, but are weaker and less dexterous.',
  data: {
    size: -1, // small (-2 str, +2 dex)
    dex: -2,
    con: 2,
    cha: 2,
    skill_perception: 2,
  },
  choices: [
    // TODO: they get a choice which craft or profession skill
  ],
}, {
  name: 'half-elf',
  description: '',
  stat_description: 'Half-elves perceive well and are adaptable.',
  data: {
    size: 0, // medium
    skill_perception: 2,
  },
  choices: [
    // TODO: they get a choice of stats
    // TODO: they recieve skill focus
  ],
}, {
  name: 'half-orc',
  description: '',
  stat_description: 'Half-orcs are just as adaptable as their human kin.',
  data: {
    skill_intimidate: 2,
  },
  choices: [
    // TODO: they get a choice of stats
  ],
}, {
  name: 'halfling',
  description: '',
  stat_description: 'Halflings are charismatic and have an indomitable spirit.',
  data: {
    size: -1, // small (-2 str, +2 dex)
    cha: 2,
    skill_acrobatics: 2,
    skill_climb: 2,
    fort_save: 1,
    will_save: 1,
    ref_save: 1,
  },
}, {
  name: 'human',
  description: '',
  stat_description: 'Humans are adaptable',
  data: {
    // they are not good, but get a couple choices
  },
  choices: [
    // TODO: they get a choice of stats
  ],
}, {
  name: 'goblin',
  description: '',
  stat_description: 'Goblins are sneaky and nimble, but frail and unlikable.',
  data: {
    size: -1,
    // there should be -2 Strength (for a total of -4, but that's dumb)
    dex: 2, // goblins get +4 dex in the book, but they don't compute size (we do!)
    cha: -2,
    skill_stealth: 4,
  },
}];


export default class Race {
  static load(name) {
    const race = races.find(r => r.name === name);
    if (!race) {
      return Promise.reject(new Error(`No known race with name ${name}`));
    }

    return Promise.resolve(race);
  }

  static all() {
    return Promise.resolve(races);
  }

  static getStats() {
    return races.map(race => ({
      name: race.name,
      fullname: race.name,
      description: race.stat_description,
    }));
  }
}
