
function round(u) {
  return Math.round(u);
}
function round00(u) {
  return Math.round(100 * u) / 100;
}

let currentTranslator = null;
export default class Translation {
  constructor() {
    this.weightUnit = 'pound';
    this.distanceUnit = 'square';
    this.language = 'en-UK';
  }
  weight(w) {
    const rounded = round00(w);
    if (this.weightUnit === 'kilograms') {
      return `${round00(rounded / 2.2)} kg`;
    }
    return `${rounded} lb${rounded !== 1 ? 's' : ''}`;
  }
  distance(d) {
    switch (this.distanceUnit) {
      case 'feet':
        return `${d} ${d === 1 ? 'foot' : 'feet'}`;
      case 'squares':
        return `${round(d / 5)} squares`;
      case 'metres':
        return `${round00(d / 3.3)} metres`;
      default:
      // They probably meant 'metre', but wrote 'meter' because
      // the world they live in is but a shadow of the real one.
        return round00(d / 3.3);
    }
  }

  static setWeightUnit(unit) {
    if (!currentTranslator) {
      // TODO: load the translator from the settings
      currentTranslator = new Translation();
    }
    currentTranslator.weightUnit = unit;
  }

  static setDistanceUnit(unit) {
    if (!currentTranslator) {
      // TODO: load the translator from the settings
      currentTranslator = new Translation();
    }
    currentTranslator.distanceUnit = unit;
  }
}

// Get the default
Translation.get = (type, metric) => {
  if (!currentTranslator) {
    // TODO: load the translator from the settings
    currentTranslator = new Translation();
  }

  // TODO: If type needs to be a number, make metric a number

  // If there isn't a translator with this string, it
  // must be a string
  if (!currentTranslator[type]) {
    return type + ((metric && metric !== 1) ? 's' : '');
  }

  return currentTranslator[type](metric);
};

// Syntactic sugar
Translation.weight = w => Translation.get('weight', w);
Translation.distance = d => Translation.get('distance', d);

Translation.WEIGHTS = [
  'pounds',
  'kilograms',
];
Translation.DISTANCES = [
  'feet',
  'metres',
  'squares',
];
