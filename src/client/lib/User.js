import Fetch from './Fetch';
import Character from './Character';

export default class User {
  constructor(config) {
    Object.keys(config).forEach((field) => {
      this[field] = config[field];
    });
  }

  saveSetting(key, value) {
    console.log('User saving setting: ', key, value);
    this.settings[key] = value;
    return this.save();
  }

  save() {
    return Fetch.save('user', this.id, {
      name: this.name,
      id: this.id,
      characters: this.characters,
      activeCharacter: this.activeCharacter,
      settings: this.settings,
    }).then((user) => {
      User.activeUser = new User(user);
      return User.activeUser;
    });
  }

  getActiveCharacter() {
    if (!this.activeCharacter) {
      return Promise.resolve(null);
    }

    return Character.load(this.activeCharacter);
  }

  static load(id) {
    return Fetch.get('user', id).then((user) => {
      // TODO: do some checks
      User.activeUser = new User(user);

      return User.activeUser;
    });
  }
}

User.activeUser = null;
