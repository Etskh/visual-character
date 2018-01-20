
import Character from '../lib/Character';
import User from '../lib/User';
import Action from '../lib/Action';

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
    const windowProps = {
      character: this.state.character,
      user: this.state.user,
    };
    // TODO: render all the different windows at once,
    // and make the tabs just make them visible
    return <div id="page">
      <Navigation
        navs={this.state.navs}/>
      { this.renderActiveNav(this.state.navs, windowProps)}
      <DebugFooter />
      <ErrorBoundary>
        <Modal />
      </ErrorBoundary>
    </div>;
  }
}
