import Console from './log';

const reduce = Function.bind.call(Function.call, Array.prototype.reduce);
const isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable);
const concat = Function.bind.call(Function.call, Array.prototype.concat);
const keys = Reflect.ownKeys;

Object.values = function values(O) {
  return reduce(keys(O), (v, k) => concat(v, typeof k === 'string' && isEnumerable(O, k) ? [O[k]] : []), []);
};

// eslint-disable-next-line camelcase
const checkFieldAgainstRule_r = (field, data, rule, config) => {
  if (typeof rule === 'object') {
    if (rule.length) {
      if (rule.indexOf(data[field]) === -1) {
        // It's an array, so it must be ONE of [...]
        config.output(`'${field}' was "${data[field]}", but must be one of ${JSON.stringify(rule)} ${config.isOptional ? 'or nothing' : ''}`);
        return false;
      }
      return true;
    }

    // It's a crazy object - so we'll have special properties
    if (rule.optional) {
      // If we say it's optional and they don't have it, it's all good in the hood
      if (!data[field]) {
        return true;
      }

      if (rule.needs && !data[rule.needs]) {
        // If the rule needs another field, and it doesnt exist,
        // whine
        config.output(`If '${field}' exists, '${rule.needs}' needs to exist as well.`);
        return false;
      }

      return checkFieldAgainstRule_r(field, data, rule.optional, {
        isOptional: true,
        output: config.output,
      });
    }

    // But it's not optional, so now we need to make sure it's good.
    return true;
  }

  // It's a string
  if (rule === 'string') {
    if (typeof data[field] !== 'string') {
      config.output(`'${field}' was "${data[field]}", but must be a string ${config.isOptional ? 'or nothing' : ''}`);
      return false;
    }
    return true;
  }

  if (rule === 'number') {
    if (typeof data[field] !== 'number') {
      // If it's not actually a number,
      // let's check if it's a string that we can parse into a number
      if (!Number.isNaN(parseFloat(data[field]))) {
        data[field] = parseFloat(data[field]);
        return true;
      }

      // Okay, well we tried
      config.output(`'${field}' was "${data[field]}", but must be a number ${config.isOptional ? 'or nothing' : ''}`);
      return false;
    }
    return true;
  }

  if (rule === 'boolean') {
    if (typeof data[field] !== 'boolean') {
      // Okay, well we tried
      config.output(`'${field}' was "${data[field]}", but must be a boolean (true|false) ${config.isOptional ? 'or nothing' : ''}`);
      return false;
    }

    return true;
  }


  if (rule === 'object' || rule === 'array') {
    if (typeof data[field] !== 'object') {
      config.output(`'${field}' was "${data[field]}", but must be an object ${config.isOptional ? 'or nothing' : ''}`);
      return false;
    }
    if (rule === 'array' && typeof data[field].length === 'undefined') {
      config.output(`'${field}' was "${JSON.stringify(data[field])}", but must be an array ${config.isOptional ? 'or nothing' : ''}`);
    }
    return true;
  }

  // Finally, if we're told to ignore it, do so
  if (rule === 'ignore') {
    return true;
  }

  Console.warn(`Unknown rule type ${rule}`);

  // Combine previous successes
  return true;
};

export const checkDataAsErrors = (data, typeRules ) => {
  // Map all fields to 'true' or 'false' then reduce then to one boolean
  return Object.keys(typeRules).reduce( (acc, field) => {
    // Check each rule individually and add together
    const output = [];
    const outputCallback = (err) => {
      output.push(err);
    }
    checkFieldAgainstRule_r(field, data, typeRules[field], {
      output: outputCallback,
    });
    // Add the outputs to the existing array
    return acc.concat(output);
  }, []) && Object.keys(data).reduce((acc, field) => {
    // Now check the data to see if there's extra data fields
    if (!typeRules[field]) {
      return acc.concat([`Unknown field '${field}'`]);
    }
    return acc;
  }, []);
}


export const checkDataAgainstRules = (data, typeRules ) => {
  if (!typeRules) {
    Console.error('Unknown typeRules');
    return false;
  }

  if (!data) {
    Console.error(`Input data is ${data}, but was expecting ${JSON.stringify(typeRules, null, 2)}`);
    return false;
  }

  // Map all fields to 'true' or 'false' then reduce then to one boolean
  const passed = Object.keys(typeRules).reduce(
    (acc, field) =>
    // Check each rule individually and add together
      acc && checkFieldAgainstRule_r(field, data, typeRules[field], {
        output: (err) => {
          Console.error(err);
        },
      })
    , true
  ) && Object.keys(data).reduce((acc, field) => {
    // Now check the data to see if there's extra data fields
    if (!typeRules[field]) {
      console.log(typeRules);
      Console.error(`Unknown field '${field}'`);
      return false;
    }
    return acc && true;
  }, true);

  if( !passed ) {
    Console.error(`   for ${data.name}`);
  }

  return passed;
};
