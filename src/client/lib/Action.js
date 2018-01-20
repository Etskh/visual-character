
import * as Action from '../../common/Action';
import User from './User';

// Main application events
Action.create('init', () => {
  // TODO: get the user from local storage
  User.load(1).then((user) => {
    Action.fire('user.change', user);
  });
});

// All UI events should go here. They should only be user-intent, such as clicking on a button
Action.create('ui.selectNavigation', (selectedNav) => {
  // Don't return this promise, we just want to save the screen for the User
  if (User.activeUser) {
    User.activeUser.saveSetting('tab', selectedNav.name);
  }
});

// When the data is changed from outside the container (or inside)
Action.create('character.change');
Action.create('user.change', (user) => {
  // if( !this.state.character || this.state.character.id != user.activeCharacter ) {
  // TODO: what if the active character is null? (the user doesn't have one selected)
  user.getActiveCharacter().then((character) => {
    Action.fire('character.change', character);
  });
  // TODO change teh translation settings here
  // }
});

export default Action;
