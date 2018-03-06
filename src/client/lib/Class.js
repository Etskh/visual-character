
const classes = [{
  id: 1,
  name: 'barbarian',
  bab_growth: 'fast',
  fort_save_growth: 'good',
  ref_save_growth: 'bad',
  will_save_growth: 'bad',
  features: [],
}, {
  id: 2,
  name: 'bard',
  bab_growth: 'average',
  fort_save_growth: 'bad',
  ref_save_growth: 'good',
  will_save_growth: 'good',
  features: [],
}, {
  id: 3,
  name: 'cleric',
  bab_growth: 'average',
  fort_save_growth: 'good',
  ref_save_growth: 'bad',
  will_save_growth: 'good',
  features: [],
}, {
  id: 4,
  name: 'druid',
  bab_growth: 'average',
  fort_save_growth: 'good',
  ref_save_growth: 'bad',
  will_save_growth: 'good',
  features: [],
}, {
  id: 5,
  name: 'fighter',
  bab_growth: 'fast',
  fort_save_growth: 'good',
  ref_save_growth: 'bad',
  will_save_growth: 'bad',
  features: [],
}, {
  id: 6,
  name: 'monk',
  bab_growth: 'average',
  fort_save_growth: 'good',
  ref_save_growth: 'good',
  will_save_growth: 'good',
  features: [],
}, {
  id: 7,
  name: 'paladin',
  bab_growth: 'fast',
  fort_save_growth: 'good',
  ref_save_growth: 'bad',
  will_save_growth: 'good',
  features: [],
}, {
  id: 8,
  name: 'ranger',
  bab_growth: 'fast',
  fort_save_growth: 'good',
  ref_save_growth: 'good',
  will_save_growth: 'bad',
  features: [],
}, {
  id: 9,
  name: 'rogue',
  bab_growth: 'average',
  fort_save_growth: 'bad',
  ref_save_growth: 'good',
  will_save_growth: 'bad',
  features: [],
}, {
  id: 10,
  name: 'sorcerer',
  bab_growth: 'slow',
  fort_save_growth: 'bad',
  ref_save_growth: 'bad',
  will_save_growth: 'good',
  features: [],
}, {
  id: 11,
  name: 'wizard',
  bab_growth: 'slow',
  fort_save_growth: 'bad',
  ref_save_growth: 'bad',
  will_save_growth: 'good',
  features: [],
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
