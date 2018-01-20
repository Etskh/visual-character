

export function round00(u) {
  return Math.round(100 * u) / 100;
}

export const WEIGHTS = [
  'pound',
  'kilogram',
];

export const DISTANCES = [
  'foot',
  'square',
  'metre',
];

export const irregularPlurals = {
  foot: 'feet',
};

export default class Translator {
  constructor() {
    this.setDistanceUnit('metre');
    this.setWeightUnit('kilogram');
  }

  setDistanceUnit(unit) {
    if (DISTANCES.indexOf(unit) === -1) {
      // Scream if we can't find the right unit
      throw new Error(`${unit} is not a distance! Expected one of ${DISTANCES.toString()}`);
    }
    this.distanceUnit = unit;
  }

  setWeightUnit(unit) {
    if (WEIGHTS.indexOf(unit) === -1) {
      // Scream if we can't find the right unit
      throw new Error(`${unit} is not a weight! Expected one of ${WEIGHTS.toString()}`);
    }
    this.weightUnit = unit;
  }

  distance(count) {
    const ratios = {
      foot: 1,
      square: 0.2,
      metre: 0.333,
    };
    const names = {
      foot: 'ft',
      square: 'sq',
      metre: 'm',
    };
    const rounded = round00(ratios[this.distanceUnit] * count);
    return `${rounded} ${names[this.distanceUnit]}`;
  }

  weight(count) {
    const ratios = {
      pound: 1,
      kilogram: 0.4536,
    };
    const names = {
      pound: 'lb',
      kilogram: 'kg',
    };
    const rounded = round00(ratios[this.weightUnit] * count);
    return `${rounded} ${names[this.weightUnit]}`;
  }

  // eslint-disable-next-line class-methods-use-this
  get(word, count) {
    if (typeof count === 'undefined' || parseInt(count, 10) === 1) {
      // If they didn't give us a count, or if it's 1
      return word;
    }

    if (typeof irregularPlurals[word] !== 'undefined') {
      // The word is irregular, and it's not 1, so we're using the plural
      return irregularPlurals[word];
    }

    // Finally, we just add s
    return `${word}s`;
  }
}
