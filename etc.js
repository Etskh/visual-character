

//
// Character
//
const character = {
  'name': 'Pig',
  'race': 'Goblin',
  'classes': {
    'Wizard': 4
  },
  'handedness': 'right',
  'held': [ // an array where 0 is main and 1 is right, etc.
    // empty hands
  ],
  'items': [],
  'possessions': [],
  'height': 2.9,
  'weight': 40.0,
  'stats': [ 9, 17, 12, 18, 13, 9 ],
  'enchantments': [{
    'name': 'Wisdom drain',
    'since': 50,
    'duration': 20,
    'effects': {
      'stats.wisdom': -3
    }
  }],

}



//
// Race
//
const races = [{
  'name': 'Goblin',
  'size': 'small',
  'hand_count': 2,
  'sexes': ['male', 'female'],
  'features': [
    'eyes',
    'ears',
  ],
}]
//
// Equipment prototype model
//
const equipmentPrototypes = [{
  'name': 'hand axe',
  'unit_weight': 3.0,
  'cost': 300,
  'hardness': 4,
  'hitpoints': 4,
  'materials': [ 'metal' ],
  'preferred_container': [
    'belt',
    true,
  ],
  'attacks': [{
    'range': 'melee',
    'damage': {
      'die': 6,
      'count': 1,
      'type': 'slashing',
    }
  }],
}, {
  'name': 'thick leather belt',
  'type': 'container',
  'sub_type': 'belt',
  'unit_weight': 0.1,
}]
//
// Classes
//
const classList = [{
  'name': 'Wizard',
}]







const createSizeController = function(size_name) {
  const sizes = {
    'small': -1,
    'medium': 0,
    'large': 1,
  }

  const mod = sizes[size_name];

  return {
    stealth_bonus: function() {
      return mod * -4;
    },
    ac_bonus: function() {
      return mod * -1;
    },
  }
}


const costAsString = function(c) {
  var output = [];

  // Gold
  if ( c > 99 ) {
    let gp = parseInt(c/100);
    c -= gp * 100;
    output.push( gp + ' gp')
  }

  // Silver
  if ( c > 9 ) {
    let sp = parseInt(c/10);
    c -= sp * 10
    output.push( sp + ' sp')
  }

  // Copper
  if ( c > 0 ) {
    let cp = parseInt(c);
    c -= cp;
    output.push( cp + ' cp')
  }

  return output.join(', ')
}



//
// Create the item from the equipment prototype
//
const createItemController = function(e) {

  const item = {
    count: 1,
  }

  return {
    data: e,
    weight: function() {
      return e.unit_weight * item.count
    }
  }
}


/*

# Pathfind

## Base Models

These models are going to be stored in either tables "in the cloud" or as JSON files locally, or from an API - they will be cached locally for speed, but might only do partial caching with the larger data-sets (equipment) (TBD)

### Choice model
 - ?

### Race model
 - has size
 - has description -> array of paragraphs or string
 - has modifiers
 - has hand_count
 - has features (eyes, ears)
   This helps with status-effects and spells that target sight
   (Color spray will not affect creatures without eyes)
 - can add choices

### Class model
 - has name, description
 - base attack bonus rate
 - spells known rate
 - spells per day rate

### Equipment model
 - has name, description
 - preferred container
 - unit weight


## Account-Based Models

These are created in relation to a unique user of the app - so all these models will be encapsulated by each other, and reference indirectly (by way of name or id) the Base Models.

### Account model
 - has email
 - has password hash
 - has list of Characters

### Character model
 - has name
 - has race
 - has sex
 - has height
 - has weight
 - has statblock
 - has enchantments (current status effects)
 - has items

### Item model
 - adds enhancements to it
 - can be enchanted
 - can be 'masterwork'
 - can contain other items (by id)
 - can be stacked
 - has id















*/
