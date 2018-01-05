import { checkDataAgainstRules } from './core';
import {
  STATS,
  CHOICE_TYPES,
  CHOICE_REASONS,
  CHARACTER_DATA,
  SKILLS,
  SLOTS,
} from './constants';
import Race from './Race';
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
  const getMod = (v) => {
    return Math.floor(v / 2) - 5;
  }
  STATS.forEach( stat => {
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
  ].forEach( stat => {
    dataCtx[stat] = createData(stat);
  });

  //
  // Skills section that includes check penalties
  //
  SKILLS.forEach( skill => {
    const name = `skill_${skill.name}`;
    dataCtx[name] = createData(name);
    dataCtx[name].addData(dataCtx[`${skill.stat}_mod`]);
    if( skill.hasCheckPenalty ) {
      dataCtx[name].addData(dataCtx.check_penalty);
    }
  });

  //
  // Carry capacity
  //
  dataCtx.light_load = createData('light_load', (v) => {
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
  // NOTE: All data should be created by this point in the function!
  //

  //
  // Defenses
  //
  dataCtx.ac.addBaseValue(10);
  dataCtx.ac.addData(dataCtx.dex_mod);
  //dataCtx.ac_flatfooted.addBaseValue(10);
  //dataCtx.ac_touch.addBaseValue(10);
  //dataCtx.ac_touch.addData(dataCtx.dex_mod);
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
    'str': 2,   // gets stronger as embiggen
    'dex': -2,  // gets more nimble as they get small
    'ac': -1,   // smaller is harder to hit
    'attack': -1, // hitting bigger stuff is easier
    'skill_stealth': -4, // stealth is easier when you're small
  };
  Object.keys(sizeAffecting).forEach( stat => {
    const name = `${stat}_from_size`;
    dataCtx[stat].addData(dataCtx[name]);
    dataCtx[name].addData(dataCtx.size);
    dataCtx[name].setTransformer((val) => {
      return val * sizeAffecting[stat];
    });
  });

  //
  // Choices
  //
  character.choices.forEach( choice => {
    if( choice.type === 'base_stat' && choice.target ) {
      /* {
        type: 'base_stat',
        target: 'str',
        decision: 10,
      } */
      dataCtx[choice.target].addChoice(choice.type, parseInt(choice.decision, 10), choice);
    }
    else if( choice.type === 'hitpoints' ) {
      dataCtx.total_hp.addChoice(choice.type, parseInt(choice.decision, 10), choice);
    }
    else if( choice.type === 'class' ) {
      /*
        type: 'class',
        decision: 'wizard',
        reason: 'level 1',
      */
      dataCtx.level.addChoice(`${choice.reason} ${choice.decision}`, 1, choice);
    }
    else if( choice.type === 'skill' && choice.target ) {
      dataCtx[`skill_${choice.target}`].addChoice(choice.type, parseInt(choice.decision, 10), choice);
    }
    else if( choice.type === 'race' && choice.decision ) {
      // TODO: load race in based on decision
      // load race
      let race = {
        name: 'goblin',
        data: {
          // nimble but unlikable
          dex: 2,
          cha: -2,
          size: -1,
        },
      };
      Object.keys(race.data).forEach( field => {
        dataCtx[field].addChoice(choice.decision, race.data[field], choice);
      });
    }
    else {
      // TODO: how to handle feats???
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
}


const download = (id) => {
  Console.log(`Downloading character ${id}...`);
  return Fetch.get('character', id).then((character) => {
    // Empty objects arent saved
    if (!character.slots) {
      character.slots = {};
    }
    if (!character.inventory) {
      character.inventory = [];
    }

    // Check over-all object
    checkDataAgainstRules(character, {
      id: 'number',
      name: 'string',
      choices: 'array', // downloadedChoiceData
      fields: 'object', // downloadedFieldData
      slots: 'ignore', // validated later
      inventory: 'ignore', // validated later
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

    // Check fields
    const characterFieldRules = {
      current: {
        age: 'number',
        exp: 'number',
        hitpoints: 'number',
        nonlethal: 'number',
      },
    };
    Object.keys(characterFieldRules).forEach((fieldType) => {
      checkDataAgainstRules(character.fields[fieldType], characterFieldRules[fieldType]);
    });

    // Check slots
    Object.keys(character.slots).forEach((slotName) => {
      if (SLOTS.indexOf(slotName) === -1) {
        Console.error(`Unknown slot name ${slotName} on character ${character.id}`);
      }
    });

    return character;
  });
};

/*
const parseClass = (character) => {
  // Class data
  //
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
  function getMetric(growth, level) {
    if (!growthTypes[growth]) {
      Console.error(`Unknown growth type "${growth}"`);
      return 0;
    }

    return growthTypes[growth](level);
  }

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
    character.data[field] = {
      // empty
    };
    Object.keys(classLevels).forEach((className) => {
      const growthMetric = classesData.find(cls => className === cls.name)[`${field}_growth`];
      character.data[field][`level ${classLevels[className]} ${className}`] =
        getMetric(growthMetric, classLevels[className]);
    });
  });

  character.data.fort_save.con_mod = character.data.con_mod.total;
  character.data.ref_save.dex_mod = character.data.dex_mod.total;
  character.data.will_save.wis_mod = character.data.wis_mod.total;

  return Promise.resolve(character);
};
*/


const parseItems = (character) => {

  const items = [];
  character.inventory.forEach((item) => {
    items.push(Items.getItem(item));
  });

  items.forEach((item) => {
    // Iterate the last number on the item
    let count = 1;
    let { name } = item; // equivalent to `let name = item.name;`
    const currentItems = character.newData.current_load.getFields();
    while (currentItems.find( field => field.name === name )) {
      // Search for the name 'morningstar 2' in the current_load
      // and if it's there, make it 'morningstar 3'
      count += 1;
      name = `${item.count} ${item.name} ${count}`;
    }
    // Set the key to be a unique name for the item
    item.key = name;
    // produces 'morningstar', 'morningstar 2', 'morningstar 3'
    character.newData.current_load.addValue(name, item.itemType.weight * item.count);
  });

  return items;
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



const parse = (character) => {
  // Initialize the data fields
  /*character.data = {
    // empty
  };
  CHARACTER_DATA.forEach((field) => {
    character.data[field] = {
      total: 0,
    };
  });*/

  // Add the player's choices for the base stats
  // Check if the player is invalid!
  const statChoice = character.choices.find(choice => choice.type === 'base_stat');
  if (!statChoice) {
    Console.error('Character hasn\'t chosen stats yet');
    character.isInvalid = true;
  }
  character.isInvalid = true;

  // Level accumulation
  //character.choices.filter(choice => choice.type === 'class').forEach((choice) => {
  //  character.data.level[choice.reason] = 1;
  //});

  ///return parseRace(character)
    //.then(totalFields)
    //.then(parseItems)
    //.then(parseMods)
    //.then(totalFields)
    //.then(parseClass)
    //.then(parseSkills)
    //.then(totalFields)
    //.then(parseRemainingData)
    //.then(totalFields)
    //.then((finalCharacter) => {
      // Check that we have all the field rules we need
      //
      // All fields are objects so let's just put them in as an array
      // and then process them to add the value
      // TODO: move this to tests
      /*checkDataAgainstRules(character.data, CHARACTER_DATA.reduce((acc, cur) => {
        acc[cur] = 'object';
        return acc;
      }, {}));
      */

  character.newData = parseData(character);
  character.items = parseItems(character);

  return character;
    //});
};


export default class Character {
  constructor(config) {
    Object.keys(config).forEach((field) => {
      this[field] = config[field];
    });

    this.onChange = null;
  }

  get(field) {
    if (!this.newData[field]) {
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
    return this.newData[field].getTotal();
  }

  takeDamage(value) {
    if (typeof value !== 'number') {
      Console.error(`Character.takeDamage: value isn't a number ("${value}" instead)`);
    }
    this.fields.current.hitpoints -= value;
    this.save().then(this.onChange);
  }

  heal(value) {
    if (typeof value !== 'number') {
      Console.error(`Character.takeDamage: value isn't a number ("${value}" instead)`);
    }
    // Set hitpoints to current + value, or at highest, the total_hp
    this.fields.current.hitpoints = Math.min(
      value + this.fields.current.hitpoints,
      this.get('total_hp')
    );

    this.save().then(this.onChange);
  }


  // TODO: add a reason parameter so we can pick which level the
  // skillpoints should be deducted from.
  addSkillPoints(points) {
    // TODO: make sure we give it an object like {
    //  spellcraft: 9,
    //  craft (carpentry): 2,
    //}
    let pointCount = 0;
    const choicesToAdd = Object.keys(points).map( skillName => {
      pointCount += points[skillName];
      // Create the skill
      return {
        type: 'skill',
        decision: points[skillName],
        target: skillName,
      };
    });
    const choiceWithPoints = this.choices.find( choice => {
      return choice.type === 'skill' && !choice.target;
    });
    const newPointCount = parseInt(choiceWithPoints.decision, 10) - pointCount;
    // equal 0, then remove it
    if( newPointCount === 0) {
      this.choices.splice(this.choices.indexOf(choiceWithPoints), 1);
    }
    else {
      choiceWithPoints.decision = newPointCount;
    }

    choicesToAdd.forEach( choice => {
      // TODO: If the choice already exists, increase it by the new value
      // if it doesn't then push it.
      this.choices.push(choice);
    });

    this.save().then(this.onChange);
  }

  save() {
    const toSave = {
      id: this.id,
      name: this.name,
      fields: this.fields,
      choices: this.choices,
      inventory: this.inventory,
      slots: this.slots,
    };
    return Fetch.save('character', this.id, toSave).then(() => this);
  }
}

Character.load = id => download(id).then(parse).then(character => new Character(character));
