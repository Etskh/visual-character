
const races = [{
  name: 'goblin',
  description: '',
  stat_description: 'Goblins are sneaky and nimble, but frail and unlikable.',
  data: {
    size: -1,
    str: -2,
    dex: 4,
    cha: -2,
    skill_stealth: 4,
  },
}];


export default class Race {
  // empty
}

Race.load = (name) => {
  const race = races.find(r => r.name === name);
  if (!race) {
    return Promise.reject(new Error(`No known race with name ${name}`));
  }

  return Promise.resolve(race);
};

Race.getStats = () => races.map(race => ({
  name: race.name,
  fullname: race.name,
  description: race.stat_description,
}));
