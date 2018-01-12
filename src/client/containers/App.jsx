
import Character from '../lib/Character';
import User from '../lib/User';

import { ErrorBoundary } from '../components/Core';
import Navigation from '../components/Navigation';
import DebugFooter from '../components/DebugFooter';
import Loading from '../components/Loading';
import Modal from '../components/Modal';

import AdvancementView from '../containers/AdvancementView';
import WorldView from '../containers/WorldView';
import CombatView from '../containers/CombatView';
import InventoryView from '../containers/InventoryView';
import OptionsView from '../containers/OptionsView';

export class App extends React.Component {
  constructor(props) {
    super(props);

    const navs = [{
      name: 'Advancement',
      icon: 'level-up',
      component: AdvancementView,
      showsWhenInvalid: true,
    }, {
      name: 'World',
      icon: 'map-o',
      component: WorldView,
    }, {
      name: 'Inventory',
      icon: 'briefcase',
      component: InventoryView,
      //}, {
      //  name: 'Magic',
      //  icon: 'flash',
    }, {
      name: 'Combat',
      icon: 'gavel',
      component: CombatView,
      //}, {
      //  name: 'Companions',
      //  icon: 'paw',
    }, {
        name: 'Options',
        icon: 'gear',
        component: OptionsView,
    }];

    this.state = {
      user: null,
      character: null,
      navs: navs.map( nav => {
        return Object.assign(nav, {
          isDisabled: false,
          isSelected: false,
        });
      }),
    };

    this.onSelectNav = this.onSelectNav.bind(this);
    this.onCharacterLoad = this.onCharacterLoad.bind(this);
    this.onUserLoad = this.onUserLoad.bind(this);
  }

  onSelectNav( selectedNav ) {
    this.state.user.saveSetting('tab', selectedNav.name);
    this.setState( prevState => {
      return {
        navs: prevState.navs.map( nav => {
          return Object.assign(nav, {
            isSelected: selectedNav.name === nav.name,
          });
        }),
      };
    });
  }

  onUserLoad(user) {
    user.onChange = () => {
      user.save().then( loadedUser => {
        this.setState({
          user: loadedUser,
        });
      });
    };

    this.setState( prevState => {
      return {
        user: user,
        // Set the user's last tab open
        navs: prevState.navs.map( nav => {
          return Object.assign(nav, {
            isSelected: nav.name === user.settings.tab,
          });
        }),
      };
    });
  }

  onCharacterLoad(character) {

    // Set the onChange handler to be this function
    character.onChange = () => {
      character.save().then( loadedCharacter => {
        this.onCharacterLoad( loadedCharacter );
      });
    };

    // Now set the state because we've loaded the character
    this.setState( prevState => {
      return {
        character: character,
        navs: prevState.navs.map( nav => {
          return Object.assign(nav, {
            isDisabled: character.isInvalid && !nav.showsWhenInvalid,
          });
        }),
      };
    });
  }

  componentDidMount() {
    // Load the user
    User.load(1).then( user => {
      this.onUserLoad(user);
      user.getActiveCharacter().then( character => {
        this.onCharacterLoad(character);
      });
    });

    // Load the first menu
    //this.onSelectNav(this.state.navs[1]);
  }

  renderActiveNav(navs, props) {
    const activeNav = navs.find( nav => nav.isSelected );
    if( !activeNav || !props.character ) {
      return <Loading/>;
    }
    if ( !activeNav.component ) {
      console.warn(`Navigation ${activeNav.name} has no component`);
      return null;
    }

    return React.createElement(activeNav.component, props, null)
  }

  render() {
    const windowProps = {
      character: this.state.character,
    };
    return <div id="page">
      <Navigation
        navs={this.state.navs}
        onSelectNav={this.onSelectNav}/>
      { this.renderActiveNav(this.state.navs, windowProps)}
      <DebugFooter />
      <ErrorBoundary>
        <Modal />
      </ErrorBoundary>
    </div>;
  }
}
