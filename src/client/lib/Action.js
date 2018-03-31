import Console from '../../common/Log';
import * as Action from '../../common/Action';
import User from './User';
import Fetch from './Fetch';
import Character from './Character';

// Main application events
Action.create('init', () => Fetch.getLocal('user').then((userId) => {
  if (!userId) {
    return Action.fire('ui.selectNavigation', { name: 'New User' });
  }
  User.load(userId).then((user) => {
    Action.fire('user.change', user);
  });

  return null;
}));
Action.create('error', (error) => {
  Console.log(error);
});


Action.create('user.login.failure');
Action.create('user.login.success', (user) => {
  // Save the current user
  Fetch.setLocal('user', user.id);
  // Set the user, then move to the new tab
  Action.fire('user.change', user);
  Action.fire('ui.selectNavigation', {
    name: user.settings.tab,
  });
});
Action.create('user.login', data =>
  // Try to log in, and if you do, congrats
  Fetch.login(data.username, data.password)
    .then(User.loadFromData)
    .then((user) => {
      Action.fire('user.login.success', user);
      return data;
    }).catch((err) => {
      if (err.httpError === 'Unauthorized') {
      // If it didn't work, then fail
        return Action.fire('user.login.failure', {
          err,
        });
      }

      // Generic error... web stuff probably?
      Console.error(err);
      Action.fire('error', err);

      return data;
    }));
Action.create('user.logout', () => {
  Fetch.setLocal('user', null);
  Action.fire('user.change', null);
});


// All UI events should go here. They should only be user-intent, such as clicking on a button
Action.create('ui.selectNavigation', (selectedNav) => {
  // TODO We just also want to make sure selectedNav is a nav object
  // Don't return this promise, we just want to save the screen for the User
  if (User.activeUser) {
    User.activeUser.saveSetting('tab', selectedNav.name);
  }
});

// When the data is changed from outside the container (or inside)
Action.create('character.change');
Action.create('user.change', (user) => {
  if (!user) {
    Action.fire('character.change', null);
    return user;
  }

  // if( !this.state.character || this.state.character.id != user.activeCharacter ) {
  // TODO: what if the active character is null? (the user doesn't have one selected)
  return user.getActiveCharacter().then((character) => {
    if (!character) {
      // TODO: Player has no active character selected
      // Take them to the character selection screen if they have more than 0 characters
      // Take them to the new character screen if they have 0
      Action.fire('error', {
        error: 'Unimplemented',
        file: __dirname,
      });
      return user;
    }

    // Have a character, now return it
    Action.fire('character.change', character);
    return user;
  }).catch((err) => {
    Action.fire('error', err);
    return user;
  });
});

Action.create('character.create', data => Character.create(data).then((character) => {
  Action.fire('character.change', character);
}));

Action.create('item.add');


export default Action;
