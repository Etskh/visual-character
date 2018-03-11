import { checkDataAgainstRules } from './core';
import {
  STATS,
  CHOICE_TYPES,
  SKILLS,
  STARTING_CHOICES,
} from './constants';
import Race from './Race';
import Class from './Class';
import * as Items from './Items';
import Fetch from './Fetch';
import Console from '../../common/Log';
import {
  createData,
} from './Data';


const parseRaces = (character, dataCtx) => {
  console.log(character, dataCtx);
  const raceChoice = character.choices.find(c => c.type === 'race' && c.decision);
  if (!raceChoice) {
    return Promise.resolve(dataCtx);
  }

  return Race.load(raceChoice.decision).then((race) => {
    Object.keys(race.data).forEach((field) => {
      dataCtx[field].addChoice(raceChoice.decision, race.data[field], raceChoice);
    });

    return dataCtx;
  });
};

const parseClasses = (character, dataCtx) => Class.all().then((classesData) => {
  console.log(character, dataCtx, classesData);
  const growthTypes = {
    // saves
    bad: lvl => Math.floor(lvl / 3),
    good: lvl => Math.floor(lvl / 2) + 2,
    // bab
    slow: lvl => Math.floor(lvl / 2),
    average: lvl => Math.floor(lvl / 1.5),
    fast: lvl => lvl,
  };

  const classLevels = {
    // empty
  };
  character.choices.forEach((choice) => {
    if (choice.type === 'class' && choice.decision) {
      if (!classLevels[choice.decision]) {
        classLevels[choice.decision] = 1;
      } else {
        classLevels[choice.decision] += 1;
      }
    }
  });

  console.log(classLevels);
  if (Object.keys(classLevels).length > 0) {
    const saves = [
      'bab',
      'fort_save',
      'ref_save',
      'will_save',
    ];
    saves.forEach((field) => {
      Object.keys(classLevels).forEach((className) => {
        console.log(classesData);
        const growthMetric = classesData.find(cls => className === cls.name)[`${field}_growth`];
        const reason = `level ${classLevels[className]} ${className}`;
        const value = growthTypes[growthMetric](classLevels[className]);
        dataCtx[field].addValue(reason, value);
      });
    });
  }

  return dataCtx;
});


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
    // If there is no decision, then reject it
    if (!choice.decision) {
      return;
    }

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
    }
  });

  return parseRaces(character, dataCtx).then( raceData => {
    return parseClasses(character, raceData);
  });
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


const download = id => Fetch.get('character', id).then((character) => {
  // Check over-all object
  checkDataAgainstRules(character, {
    id: 'number',
    name: 'string',
    choices: 'array', // downloadedChoiceData
    history: 'ignore', // TODO: Verify history objects
    inventory: 'ignore',
  });

  // Check choices
  character.choices.forEach((choice) => {
    checkDataAgainstRules(choice, {
      type: CHOICE_TYPES,
      // TODO: regulate reasons differently
      reason: 'ignore', // CHOICE_REASONS,
      decision: {
        optional: 'string',
      },
      target: {
        optional: 'string',
        needs: 'decision',
      },
    });
  });

  return Object.assign(character, {
    history: character.history || [],
  });
});


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

  // Gaining total hit points will increase the current as well
  const totalHp = character.data.total_hp.getTotal();

  return {
    exp: sumHistoryByType('exp'),
    hitpoints: totalHp + Math.min(sumHistoryByType('heal') - sumHistoryByType('damage'), 0),
  };
};


const parse = (characterData) => {
  // Initialize the data fields
  const character = Object.assign({
    history: [], // if there is no history
  }, characterData);

  // Add the player's choices for the base stats
  // Check if the player is invalid!
  const statChoice = characterData.choices.find(choice => choice.type === 'base_stat');
  if (!statChoice) {
    Console.error('Character hasn\'t chosen stats yet');
    character.isInvalid = true;
  }

  return parseData(character).then((data) => {
    character.data = data;

    character.items = parseItems(character);
    character.actions = parseActions(character);
    character.fields = parseFields(character);

    return character;
  });
};


export default class Character {
  constructor(config) {
    Object.keys(config).forEach((field) => {
      this[field] = config[field];
    });

    if (!this.history) {
      this.history = [];
    }
  }

  get(field) {
    if (!this.data[field]) {
      // If the data field doesn't exist
      if (this.fields[field]) {
        return this.fields[field];
      }

      // Okay, we don't know what it is
      Console.error(`Unknown field "${field}"`);
      return 0;
    }

    // Return the total of the computed field data
    return this.data[field].getTotal();
  }


  replaceChoiceWithChoices(oldChoice, newChoices) {
    // Find the choice like oldChoice
    const choicesWithoutOld = this.choices.filter(c => !(c.type === oldChoice.type
        && c.decision === oldChoice.decision
        && c.target === oldChoice.target
        && c.reason === oldChoice.reason));

    this.choices = choicesWithoutOld.concat(newChoices);

    return this.save();
  }

  replaceChoice(oldChoice, newChoice) {
    return this.replaceChoiceWithChoices(oldChoice, [newChoice]);
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

  setBaseScores(scores) {
    // Strip out all "base_stat" choices (it's the blank one)
    const choicesWithoutStat = this.choices.filter(c => c.type !== 'base_stat');

    // Add all our base scores
    this.choices = choicesWithoutStat.concat(Object.keys(scores).map(scoreName => ({
      type: 'base_stat',
      decision: scores[scoreName],
      reason: 'level 1',
      target: scoreName,
    })));
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

  selectRace(race) {
    // Selects any race no matter what
    const raceChoice = this.choices.find(c => c.type === 'race');
    raceChoice.decision = race.name;
    return this.save();
  }

  selectHitpoints(num) {
    const hpChoice = this.choices.find(c => (c.type === 'hitpoints' && !c.decision));
    if (!hpChoice) {
      return Promise.reject(new Error('Can\'t find an empty hitpoints choice'));
    }

    this.replaceChoice(hpChoice, {
      type: 'hitpoints',
      decision: num,
      reason: hpChoice.reason,
      target: hpChoice.target,
    });

    return this.save();
  }

  selectClass(cls) {
    // Changes the unchosen decision
    const classChoice = this.choices.find(c => (c.type === 'class' && !c.decision));
    classChoice.decision = cls.name;

    // Find the current level of the chosen class
    const classCount = this.choices.filter(c => c.type === 'class' && c.decision === cls.name).length;

    // Total level of the class
    // FIXME: this breaks leveling up, as it is the current level of the chosen class,
    // but not necessarily the first class ever
    if (classCount === 1) {
      // This is the first level, so add what a first-level class will get
      this.choices.push({
        type: 'hitpoints',
        decision: cls.hitdice,
        reason: `level 1 ${cls.name}`,
      });
    } else {
      // If it's the second level-up or higher, they need to choose hitpoints
      this.choices.push({
        type: 'hitpoints',
        decision: null,
        reason: `level ${classCount} ${cls.name}`,
        target: cls.hitdice,
      });
    }

    // And now for the rest of the skills
    this.choices.push({
      type: 'skill',
      // Leveling up gives the character CLASS_SKILL_POINTS + INT_MOD per level, min 1
      decision: Math.max(cls.skill_points + this.get('int_mod'), 1),
      reason: `level ${classCount} ${cls.name}`,
    });

    return this.save();
  }

  save() {
    const toSave = {
      id: this.id,
      name: this.name,
      history: this.history,
      choices: this.choices,
    };

    return Fetch.save('character', this.id, toSave).then(characterData => parse(characterData).then(character => new Character(character)));
  }
}

Character.create = (data) => {
  const characterData = {
    name: data.name,
    choices: STARTING_CHOICES,
    history: [], // nothing happened yet!
  };
  return Fetch.save('character', 'new', characterData).then(savedData => parse(savedData).then(character => new Character(character)));
};

Character.load = id => download(id).then(parse).then(character => new Character(character));

// FIXME: This is hacky, but it's used to reduce overhead
// (download only the character, but no parsing.
// Maybe we should include the names in the user to remove this)
Character.download = download;
