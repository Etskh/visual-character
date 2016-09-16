



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
