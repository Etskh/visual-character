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

const download = (id) => {
  console.log(`Downloading character ${id}...`);
  return new Promise((resolve, reject) => {
    $.get(`/api/character/${id}`, (obj, data) => {
      if (data !== 'success') {
        return reject(obj);
      }
      const character = obj;
      // Empty objects arent saved
      if (!obj.slots) {
        obj.slots = {};
      }
      if (!obj.inventory) {
        obj.inventory = [];
      }

      // Check over-all object
      checkDataAgainstRules(character, {
        id: 'number',
        age: 'number',
        name: 'string',
        choices: 'array', // downloadedChoiceData
        fields: 'object', // downloadedFieldData
        slots: 'object', // downloadedSlots
        inventory: 'array', // validated already
      });

      // Check choices
      character.choices.forEach((choice) => {
        checkDataAgainstRules(choice, {
          type: CHOICE_TYPES,
          reason: CHOICE_REASONS,
          decision: {
            optional: 'string',
          },
          remaining: {
            optional: 'number',
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
          console.error(`Unknown slot name ${slotName} on character ${character.id}`);
        }
      });

      // Check inventory
      character.inventory.forEach((item) => {
        checkDataAgainstRules(item, {
          count: {
            optional: 'number',
          },
          itemType: Items.itemTypes.map( type => type.name ),
          material: Items.materials.map( mat => mat.name ),
        });
      });

      return resolve(character);
    });
  });
};


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
  function getMetric(growth, level) {
    const growthTypes = {
      slow: level => Math.floor(level / 2),
      bad: level => Math.floor(level / 3),
      good: level => Math.floor(level / 2) + 2,
    };
    if (!growthTypes[growth]) {
      console.error(`Unknown growth type "${growth}"`);
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
  ].forEach((field) => {
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


const parseItems = (character) => {
  // TODO: add up magical effects of items
  const size = character.data.size.total;
  // Shift up every size below small
  let sizeMultiple = Math.pow(2, size + (size < 0 ? 1 : 0));
  // Edge-case for 'small'
  if (size === -1) {
    sizeMultiple = 0.75;
  }
  const str = character.data.str.total;

  character.data.light_load = {
    light_load: Math.round((
      str * 2.5 +
      Math.pow(1.25, str)
    ) * sizeMultiple),
  };

  character.items = [];
  character.inventory.forEach( item => {
    character.items.push(Items.getItem(item));
  });

  character.items.forEach( item => {
    // Iterate the last number on the item
    let count = 1;
    let name = item.name;
    while ( character.data.current_load[name] ) {
      name = `${item.count} ${item.name} ${++count}`;
    }
    // Set the key to be a unique name for the item
    item.key = name;
    // produces 'morningstar', 'morningstar 2', 'morningstar 3'
    character.data.current_load[name] = item.itemType.weight * item.count;
  });

  return Promise.resolve(character);
};

const parseSkills = (character) => {
  SKILLS.forEach((skill) => {
    /* {
      name: 'stealth',
      sizeTranslator: (size) => ( size * -4 ),
      stat: 'dex',
      hasCheckPenalty: true,
    } */
    const field = `skill_${skill.name}`;

    // TODO: add points
    character.data[field].points = 0;

    // dex_mod
    character.data[field][`${skill.stat}_mod`] = character.data[`${skill.stat}_mod`].total;

    // if check penalty, add it
    if (skill.hasCheckPenalty) {
      character.data[field].check_penalty = character.data.check_penalty.total;
    }

    // if size matters add it ;)
    if (skill.sizeTranslator) {
      character.data[field].size = skill.sizeTranslator(character.data.size.total);
    }
  });

  return Promise.resolve(character);
};

const parseRace = (character) => {
  // Things race affects:
  const raceChoice = character.choices.find(choice => choice.type === 'race');
  if (!raceChoice) {
    console.error('Character hasn\'t chosen race yet');
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


const parseMods = (character) => {
  // Then get the mods of the stats once we add up all the item
  // bonuses and status effects
  STATS.forEach((stat) => {
    character.data[`${stat}_mod`] = {
      hidden: Math.floor((character.data[stat].total / 2) - 5),
    };
  });

  return Promise.resolve(character);
};


const parseRemainingData = (character) => {
  // Below here, relies on stats
  character.data.total_hp = {
    con_mod_x_level: character.data.con_mod.total * character.data.level.total,
  };
  character.choices.forEach((choice) => {
    if (choice.type === 'hitpoints') {
      character.data.total_hp[choice.reason] = parseInt(choice.decision);
    }
  });

  character.data.ac = {
    base: 10,
    dex_mod: character.data.dex_mod.total,
    size: character.data.size.total * -1,
  };
  character.data.ac_flatfooted = {
    base: 10,
    size: character.data.size.total * -1,
  };
  character.data.ac_touch = {
    base: 10,
    dex_mod: character.data.dex_mod.total,
    size: character.data.size.total * -1,
  };
  character.data.check_penalty = {
    base: 0,
  };

  return Promise.resolve(character);
};


const totalFields = (character) => {
  // Total up all the fields
  Object.keys(character.data).forEach((field) => {
    character.data[field].total = Object.keys(character.data[field]).reduce((acc, cur) => {
      if (cur !== 'total') {
        return character.data[field][cur] + acc;
      }
      return acc;
    }, 0);
  });
  return Promise.resolve(character);
};


const parse = (character) => {
  // Initialize the data fields
  character.data = {
    // empty
  };
  CHARACTER_DATA.forEach((field) => {
    character.data[field] = {
      total: 0,
    };
  });

  // Add the player's choices for the base stats
  STATS.forEach((stat) => {
    const statChoice = character.choices.find(choice => choice.type === stat);
    if (!statChoice) {
      console.error('Character hasn\'t chosen stats yet');
      character.isInvalid = true;
    } else {
      // Assign the base stat to the data
      character.data[stat].base = parseInt(statChoice.decision);
    }
  });
  // TODO: Add the level-up stat choice


  // Level accumulation
  character.choices.filter(choice => choice.type === 'class').forEach((choice) => {
    character.data.level[choice.reason] = 1;
  });

  return parseRace(character)
    .then(totalFields)
    .then(parseItems)
    .then(parseMods)
    .then(totalFields)
    .then(parseClass)
    .then(parseSkills)
    .then(totalFields)
    .then(parseRemainingData)
    .then(totalFields)
    .then((character) => {
      // Check that we have all the field rules we need
      //
      // All fields are objects so let's just put them in as an array
      // and then process them to add the value
      checkDataAgainstRules(character.data, CHARACTER_DATA.reduce((acc, cur) => {
        acc[cur] = 'object';
        return acc;
      }, {}));

      console.log(character);

      return character;
    });
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
      console.error(`Unknown field "${field}"`);
      return 0;
    }

    // Return the total of the computed field data
    return this.data[field].total;
  }

  breakdown(field) {
    if (!this.data[field]) {
      // Okay, we don't know what it is
      console.error(`Unknown field "${field}"`);
      return {
        // empty
      };
    }

    return this.data[field];
  }

  takeDamage(value) {
    if (typeof value !== 'number') {
      console.error(`Character.takeDamage: value isn't a number ("${value}" instead)`);
    }
    this.fields.current.hitpoints -= value;
    this.save().then(this.onChange);
  }

  heal(value) {
    if (typeof value !== 'number') {
      console.error(`Character.takeDamage: value isn't a number ("${value}" instead)`);
    }
    // Set hitpoints to current + value, or at highest, the total_hp
    this.fields.current.hitpoints = Math.min(
      value + this.fields.current.hitpoints,
      this.get('total_hp')
    );

    this.save().then(this.onChange);
  }

  save() {
    return new Promise((resolve) => {
      const toSave = {
        id: this.id,
        name: this.name,
        fields: this.fields,
        choices: this.choices,
        inventory: this.inventory,
        slots: this.slots,
      };
      $.post(`/api/character/${this.id}`, toSave, (obj, data, jqXhr) => {
        if (data !== 'success') {
          return reject(obj);
        }
        return resolve(this);
      });
    });
  }
}

Character.load = id => download(id).then(parse).then(character => new Character(character));
