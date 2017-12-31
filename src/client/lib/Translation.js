

let currentTranslator = null;
export default class Translation {
  // Pounds
  weight(w) {
    //return `${Math.round(100*w/2.2)/100} kg`;
    return `${w} lb${w!==1?'s':''}`;
  }
}

// Get the default
Translation.get = (type, metric) => {
  if( !currentTranslator ) {
    // TODO: load the translator from the settings
    currentTranslator = new Translation();
  }

  // TODO: If type needs to be a number, make metric a number

  // If there isn't a translator with this string, it
  // must be a string
  if( !currentTranslator[type] ) {
    return type + ((metric && metric !== 1) ? 's' : '');
  }

  return currentTranslator[type](metric);
}

// Input is in pounds
Translation.weight = (w) => {
  return Translation.get('weight', w);
}
