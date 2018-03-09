import { checkDataAgainstRules } from './core';

/*
{
  id: 1,
  name: 'barbarian',
  bab_growth: 'fast',
  fort_save_growth: 'good',
  ref_save_growth: 'bad',
  will_save_growth: 'bad',
  features: [],
  info: {
    description: 'Intimidate! Instigate! Crush! Charge! Rally! RAGE! Repeat.',
    playstyle: BOLD,
    caster: NO,
    melee: YES,
  },
}
*/

const rulesets = [
  new Ruleset({
    name: 'class',
    getter: () => {
      // if the current list of 's is [] then try to load them
    },
    validate: (data) => {
      return checkDataAgainstRules(data, {
        'id': 'number',
        'name': 'string',
        'bab_growth': [ 'fast', 'average', 'slow'],
        'fort_save_growth': [ 'good', 'bad'],
        'ref_save_growth': [ 'good', 'bad'],
        'will_save_growth': [ 'good', 'bad'],
        'features': 'array',
        'info': 'ignore',
      }) && checkDataAgainstRules(data.info, {
        'description': 'string',
        'playstyle': [ 'BOLD', 'ADAPTABLE', 'THOUGHFUL' ],
        'caster': ['NO', 'WEAK', 'STRONG'],
        'melee': ['YES', 'NO', 'MAYBE'],
      });
    },
  }),
]
