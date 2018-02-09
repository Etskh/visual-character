import { checkDataAgainstRules } from './core';
import {
  STATS,
  CHOICE_TYPES,
  CHOICE_REASONS,
  SKILLS,
} from './constants';
// import Race from './Race'; TODO: use this component to get race info
import * as Items from './Items';
import Fetch from './Fetch';
import Console from './log';
import {
  createData,
} from './Data';


export const parseData = (character) => {
  const dataCtx = {
    // empty
  };

  //
  // Get the stats
  //
  const getMod = v => Math.floor(v / 2) - 5;
  STATS.forEach((stat) => {
    dataCtx[stat] = createData(stat);
    dataCtx[`${stat}_mod`] = createData(`${stat}_mod`, getMod);
    dataCtx[`${stat}_mod`].addData(dataCtx[stat]);
  });
  // At least create them so we can reference things
  // like check penalty and ac
  [
    'level',
    // item stuff
    'ac',
    'check_penalty',
    'total_hp',
    'light_load',
    'current_load',
    // action stuff
    'attack',
    'melee_main_attack',
    'ranged_main_attack',
    // class stuff
    'bab',
    'fort_save',
    'ref_save',
    'will_save',
    // Race stuff
    'size',
    'str_from_size',
    'dex_from_size',
    'ac_from_size',
    'attack_from_size',
    'skill_stealth_from_size',
  ].forEach((stat) => {
    dataCtx[stat] = createData(stat);
  });

  //
  // Skills section that includes check penalties
  //
  SKILLS.forEach((skill) => {
    const name = `skill_${skill.name}`;
    dataCtx[name] = createData(name);
    // NOTE: skill points are added later
    dataCtx[name].addData(dataCtx[`${skill.stat}_mod`]);
    if (skill.hasCheckPenalty) {
      dataCtx[name].addData(dataCtx.check_penalty);
    }
  });
  //
  // NOTE: All data should be created by this point in the function!
  //


  //
  // Carry capacity
  //
  dataCtx.light_load.setTransformer(() => {
    const str = dataCtx.str.getTotal();
    const size = dataCtx.size.getTotal();
    let sizeMultiple = 2 ** (size + (size < 0 ? 1 : 0));
    // Edge-case for 'small'
    if (size === -1) {
      sizeMultiple = 0.75;
    }
    return Math.round((
      (str * 2.5) +
        (1.25 ** str)
    ) * sizeMultiple);
  });

  //
  // Defenses
  //
  dataCtx.ac.addBaseValue(10);
  dataCtx.ac.addData(dataCtx.dex_mod);
  // dataCtx.ac_flatfooted.addBaseValue(10);
  // dataCtx.ac_touch.addBaseValue(10);
  // dataCtx.ac_touch.addData(dataCtx.dex_mod);
  dataCtx.will_save.addData(dataCtx.wis_mod);
  dataCtx.ref_save.addData(dataCtx.dex_mod);
  dataCtx.fort_save.addData(dataCtx.con_mod);
  // TODO: multiply it by the levels you are
  dataCtx.total_hp.addData(dataCtx.con_mod);
  //
  // Attacks
  //
  dataCtx.melee_main_attack.addData(dataCtx.bab);
  dataCtx.melee_main_attack.addData(dataCtx.str_mod);
  dataCtx.melee_main_attack.addData(dataCtx.attack);
  dataCtx.ranged_main_attack.addData(dataCtx.bab);
  dataCtx.ranged_main_attack.addData(dataCtx.dex_mod);
  dataCtx.ranged_main_attack.addData(dataCtx.attack);

  //
  // Stats affected by size
  //
  const sizeAffecting = {
    str: 2, // gets stronger as embiggen
    dex: -2, // gets more nimble as they get small
    ac: -1, // smaller is harder to hit
    attack: -1, // hitting bigger stuff is easier
    skill_stealth: -4, // stealth is easier when you're small
  };
  Object.keys(sizeAffecting).forEach((stat) => {
    const name = `${stat}_from_size`;
    dataCtx[stat].addData(dataCtx[name]);
    dataCtx[name].addData(dataCtx.size);
    dataCtx[name].setTransformer(val => val * sizeAffecting[stat]);
  });

  //
  // Choices
  //
  character.choices.forEach((choice) => {
    if (choice.type === 'base_stat' && choice.target) {
      /* {
        type: 'base_stat',
        target: 'str',
        decision: 10,
      } */
      dataCtx[choice.target].addChoice(choice.type, parseInt(choice.decision, 10), choice);
    } else if (choice.type === 'hitpoints') {
      /*
        type: 'hitpoints',
        decision: '6',
        reason: 'level 1 wizard',
      */
      dataCtx.total_hp.addChoice(choice.type, parseInt(choice.decision, 10), choice);
    } else if (choice.type === 'class') {
      /*
        type: 'class',
        decision: 'wizard',
        reason: 'level 1',
      */
      dataCtx.level.addChoice(`${choice.reason} ${choice.decision}`, 1, choice);
    } else if (choice.type === 'skill' && choice.target) {
      /*
        type: 'skill',
        decision: '6',
        reason: 'level 1',
        target: 'spellcraft',
      */
      if (!dataCtx[`skill_${choice.target}`]) {
        // Error checking is important, mmk?
        Console.error(`skill_${choice.target} doesn't exist. Why would you do this?`);
        Console.error(Object.keys(dataCtx));
      }
      dataCtx[`skill_${choice.target}`].addChoice('points', parseInt(choice.decision, 10), choice);
    } else if (choice.type === 'race' && choice.decision) {
      /*
        type: 'race',
        decision: 'goblin',
        reason: 'level 1',
      */
      // TODO: load race in based on decision
      // load race
      const race = {
        name: 'goblin',
        data: {
          // nimble but unlikable
          dex: 2,
          cha: -2,
          size: -1,
        },
      };
      Object.keys(race.data).forEach((field) => {
        dataCtx[field].addChoice(choice.decision, race.data[field], choice);
      });
    } else {
      // TODO: how to do feats???
    }
  });

  // All classes
  // TODO: load classes in
  const classesData = [{
    id: 1,
    name: 'wizard',
    bab_growth: 'slow',
    fort_save_growth: 'bad',
    ref_save_growth: 'bad',
    will_save_growth: 'good',
    features: [],
  }];
  const growthTypes = {
    slow: lvl => Math.floor(lvl / 2),
    bad: lvl => Math.floor(lvl / 3),
    good: lvl => Math.floor(lvl / 2) + 2,
  };

  const classLevels = {
    // empty
  };
  character.choices.forEach((choice) => {
    if (choice.type === 'class') {
      if (!classLevels[choice.decision]) {
        classLevels[choice.decision] = 1;
      } else {
        classLevels[choice.decision] += 1;
      }
    }
  });
  const saves = [
    'bab',
    'fort_save',
    'ref_save',
    'will_save',
  ];
  saves.forEach((field) => {
    Object.keys(classLevels).forEach((className) => {
      const growthMetric = classesData.find(cls => className === cls.name)[`${field}_growth`];
      const reason = `level ${classLevels[className]} ${className}`;
      const value = growthTypes[growthMetric](classLevels[className]);
      dataCtx[field].addValue(reason, value);
    });
  });

  return dataCtx;
};


const parseActions = () => {
  const actions = [];

  // Add skill actions
  SKILLS.forEach((skill) => {
    if (skill.actions) {
      skill.actions.forEach((action) => {
        actions.push({
          ...action,
          stat: `skill_${skill.name}`,
        });
      });
    }
  });

  // Add combat actions based on items
  actions.push({
    name: 'Shoot heavy crossbow',
    when: 'combat',
    stat: 'ranged_main_attack',
    type: 'ranged',
    description: 'Unleash a bolt from your readied crossbow',
    blocks: [{
      type: 'roll',
      stat: 'ranged_main_attack',
      target: 'AC',
    }],
  });

  return actions;
};


const download = (id) => {
  Console.log(`Downloading character ${id}...`);
  return Fetch.get('character', id).then((character) => {
    // Check over-all object
    checkDataAgainstRules(character, {
      id: 'number',
      name: 'string',
      choices: 'array', // downloadedChoiceData
      history: 'array', // TODO: Verify history objects
      inventory: 'ignore',
    });

    // Check choices
    character.choices.forEach((choice) => {
      checkDataAgainstRules(choice, {
        type: CHOICE_TYPES,
        reason: CHOICE_REASONS,
        decision: {
          optional: 'string',
        },
        target: {
          optional: 'string',
          needs: 'decision',
        },
      });
    });

    return Object.assign(character, {});
  });
};


const parseItems = (character) => {
  // Translate old inventory to new history type
  /*
  if (character.inventory) {
    const lastId = character.history.filter(action =>
      action.type === 'add_item'
    ).reduce((acc, cur) => (parseInt(cur, 10) > acc ? parseInt(cur, 10) : acc), 1);
    const historyItems = character.inventory.map(item => ({
      type: 'add_item',
      target: {
        id: lastId += 1,
        itemType: item.itemType,
        count: item.count ? item.count : 1,
      },
    }));
    // To generate the item history, use this output!
    console.log(JSON.stringify(historyItems, null, 2));
  }
  */

  const items = character.history.filter(action => action.type === 'add_item').filter(action =>
    // Now find out if we later removed the same item.
    // Returns true if we haven't removed it yet
    character.history.find(history => history.type === 'remove_item' && action.target.id === history.target.id) == null).map(action => Items.getItem(action.target));

  return items.map((item) => {
    // Iterate the last number on the item
    let count = 1;
    let { name } = item; // equivalent to `let name = item.name;`
    const currentItems = character.data.current_load.getFields();
    const itemFinder = field => (field.name === name);
    while (currentItems.find(itemFinder)) {
      // Search for the name 'morningstar 2' in the current_load
      // and if it's there, make it 'morningstar 3'
      count += 1;
      name = `${item.count} ${item.name} ${count}`;
    }

    // produces 'morningstar', 'morningstar 2', 'morningstar 3'
    character.data.current_load.addValue(name, item.itemType.weight * item.count);

    return Object.assign(item, {
      // Set the key to be a unique name for the item
      key: name,
    });
  });
};

const parseFields = (character) => {
  const sumByType = (array, field, type) => array.reduce((acc, cur) => {
    if (cur.type === type) {
      return acc + parseInt(cur[field], 10);
    }
    return acc;
  }, 0);
  const sumHistoryByType = sumByType.bind(this, character.history, 'value');
  // const sumChoiceByType = sumByType.bind(this, character.choices, 'decision');

  return {
    current: {
      exp: sumHistoryByType('exp'),
      hitpoints: sumHistoryByType('heal') - sumHistoryByType('damage'),
    },
  };
};

/*
const parseRace = (character) => {
  // Things race affects:
  const raceChoice = character.choices.find(choice => choice.type === 'race');
  if (!raceChoice) {
    Console.error('Character hasn\'t chosen race yet');
    return Promise.resolve(character);
  }

  return Race.load(raceChoice.decision).then((race) => {
    // Set the character's race
    character.race = race;

    // Set all the race data
    Object.keys(character.race.data).forEach((fieldName) => {
      character.data[fieldName][character.race.name] = character.race.data[fieldName];
    });

    return character;
  });
};
*/


const parse = (characterData) => {
  // Initialize the data fields
  const character = Object.assign({}, characterData);

  // Add the player's choices for the base stats
  // Check if the player is invalid!
  const statChoice = characterData.choices.find(choice => choice.type === 'base_stat');
  if (!statChoice) {
    Console.error('Character hasn\'t chosen stats yet');
    character.isInvalid = true;
  }

  character.data = parseData(character);
  character.items = parseItems(character);
  character.actions = parseActions(character);
  character.fields = parseFields(character);
  Console.log(character);

  return Promise.resolve(character);
};


export default class Character {
  constructor(config) {
    Object.keys(config).forEach((field) => {
      this[field] = config[field];
    });

    this.onChange = null;
  }

  get(field) {
    if (!this.data[field]) {
      // If the data field doesn't exist
      if (this.fields.current[field]) {
        // Return the current value for the field they're asking for
        // if we have it, for example:
        //   current: {
        //     hitpoints: 5
        //   }
        return this.fields.current[field];
      }

      // Okay, we don't know what it is
      Console.error(`Unknown field "${field}"`);
      return 0;
    }

    // Return the total of the computed field data
    return this.data[field].getTotal();
  }

  takeDamage(value) {
    if (typeof value !== 'number') {
      Console.error(`Character.takeDamage: value isn't a number ("${value}" instead)`);
    }

    this.history.push({
      type: 'damage',
      value,
    });

    return this.save();
  }

  heal(value) {
    if (typeof value !== 'number') {
      Console.error(`Character.takeDamage: value isn't a number ("${value}" instead)`);
    }

    this.history.push({
      type: 'heal',
      value,
    });

    return this.save();
  }

  addExp(value) {
    this.history.push({
      type: 'exp',
      value,
    });

    return this.save();
  }


  addSkillPoints(points, reason) {
    // make sure we get an object like {
    //  spellcraft: 9,
    //  craft (carpentry): 2,
    // }
    Object.keys(points).map(skillName =>
      // Map each object to an array of { name, value } objects
      ({
        name: skillName,
        value: points[skillName],
      })).forEach((pointData) => {
      // pointData: { name: 'spellcraft', value: 9 }
      checkDataAgainstRules(pointData, {
        name: SKILLS.map(s => s.name), // one of skill name
        value: 'number', // and the value should be a number
      });
    });
    let pointCount = 0;
    const choicesToAdd = Object.keys(points).map((skillName) => {
      pointCount += points[skillName];
      // Create the skill
      return {
        type: 'skill',
        decision: points[skillName],
        reason,
        target: skillName,
      };
    });
    const choiceWithPoints = this.choices.find(choice => choice.type === 'skill' && !choice.target);
    const newPointCount = parseInt(choiceWithPoints.decision, 10) - pointCount;
    if (newPointCount === 0) {
      // equal 0, then remove it
      this.choices.splice(this.choices.indexOf(choiceWithPoints), 1);
    } else {
      // otherwise, just subtract the points
      choiceWithPoints.decision = newPointCount;
    }

    choicesToAdd.forEach((choice) => {
      this.choices.push(choice);
    });

    return this.save();
  }

  save() {
    const toSave = {
      id: this.id,
      name: this.name,
      history: this.history,
      choices: this.choices,
      // inventory: this.inventory,
    };
    return Fetch.save('character', this.id, toSave).then(characterData => parse(characterData).then(character => new Character(character)));
  }
}

Character.load = id => download(id).then(parse).then(character => new Character(character));
