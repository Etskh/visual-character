
import Character from '../lib/Character';
import User from '../lib/User';
import Action from '../lib/Action';

import { ErrorBoundary } from '../components/Core';
import Navigation from '../components/Navigation';
import DebugFooter from '../components/DebugFooter';
import Loading from '../components/Loading';
import Modal from '../components/Modal';
import HamburgerMenu from '../components/HamburgerMenu';

import AdvancementView from '../containers/views/AdvancementView';
import WorldView from '../containers/views/WorldView';
import CombatView from '../containers/views/CombatView';
import InventoryView from '../containers/views/InventoryView';
import OptionsView from '../containers/views/OptionsView';
import NewCharacterView from '../containers/views/NewCharacterView';
import ChangelogView from '../containers/views/ChangelogView';

import AdvancementRaceView from '../containers/advancement/AdvancementRaceView';

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
      icon: 'compass',
      component: WorldView,
    }, {
      name: 'Inventory',
      icon: 'diamond',
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
      isVisible: false,
    }, {
      name: 'New Character',
      icon: 'plus',
      component: NewCharacterView,
      isVisible: false,
    }, {
      name: 'Changelog',
      icon: 'plus',
      component: ChangelogView,
      isVisible: false,
    }, {
      name: 'Race Selection',
      icon: 'plus',
      component: AdvancementRaceView,
      isVisible: false,
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
  }

  componentDidMount() {
    Action.subscribeAll(this, __filename, {
      'ui.selectNavigation': this.onSelectNavigation,
      'user.change': this.onUserChange,
      'character.change': this.onCharacterChange,
    });

    Action.fire('init');
  }

  componentWillUnmount() {
    Action.unsubscribeAll(__filename);
  }

  onSelectNavigation(selectedNav) {
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

  onUserChange( user ) {
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

  onCharacterChange( character ) {
    this.setState( prevState => {
      return {
        character: character,
        // Disable navs if the character is invalid
        navs: prevState.navs.map( nav => {
          return Object.assign(nav, {
            isDisabled: character.isInvalid && !nav.showsWhenInvalid,
          });
        }),
      };
    });
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
    // TODO: render all the different windows at once,
    // and make the tabs just make them visible
    return <div id="page">
      <Navigation
        navs={this.state.navs}/>
      { this.renderActiveNav(this.state.navs, {
        character: this.state.character,
        user: this.state.user,
      })}
      <DebugFooter />
      <ErrorBoundary>
        <HamburgerMenu
          user={this.state.user}
          character={this.state.character}/>
        <Modal />
      </ErrorBoundary>
    </div>;
  }
}
