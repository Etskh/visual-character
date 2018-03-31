
import Character from '../lib/Character';
import User from '../lib/User';
import Action from '../lib/Action';

import {
  Row,
  Col,
  Button,
  ErrorBoundary
} from '../components/Core';
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
import NewUserView from '../containers/views/NewUserView';
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
      bypassCharacterCheck: true,
    }, {
      name: 'New Character',
      icon: 'plus',
      component: NewCharacterView,
      isVisible: false,
      bypassCharacterCheck: true,
    }, {
      name: 'New User',
      icon: 'plus',
      component: NewUserView,
      isVisible: false,
      bypassCharacterCheck: true,
    }, {
      name: 'Changelog',
      icon: 'plus',
      component: ChangelogView,
      isVisible: false,
      bypassCharacterCheck: true,
    }];

    this.state = {
      error: null,
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
    Action.subscribeAll(this, 'App', {
      'error': this.onError,
      // 'user.logout': this.onLogout,
      'ui.selectNavigation': this.onSelectNavigation,
      'user.change': this.onUserChange,
      'character.change': this.onCharacterChange,
      'item.add': this.onItemAdd,
    });

    Action.fire('init');
  }

  componentWillUnmount() {
    Action.unsubscribeAll('App');
  }

  onError(error) {
    this.setState({
      error: JSON.stringify(error),
    });
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
            isSelected: user ?
              // if there is a user, use their settings
              // otherwise, let's set it to New User because.. .we dont have one
              nav.name === user.settings.tab : 'New User' === nav.name,
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
            isDisabled: (character && character.isInvalid) && !nav.showsWhenInvalid,
          });
        }),
      };
    });
  }

  onItemAdd( config ) {
    // config has type and count
    this.state.character.addItem(config.type, config.count).then( character => {
      Action.fire('character.change', character);
    });
  }

  renderActiveNav(navs, props) {
    const activeNav = navs.find( nav => nav.isSelected ) || null;
    if( !activeNav ) {
      console.warn('No active nav');
      return <Loading/>;
    }
    if( !activeNav.bypassCharacterCheck && !this.state.character ) {
      console.warn('No character check and no character');
      console.log(activeNav);
      return <Loading/>;
    }

    // TODO: if we have a real nav, but we're waiting for the character,
    // show the loading component

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
      <ErrorBoundary>
        { !this.state.user ? null :
          <Navigation
            navs={this.state.navs}/>
        }
        { !this.state.user ? null :
          <HamburgerMenu
            user={this.state.user}
            character={this.state.character}/>
        }
        {!this.state.error ? null : <div className='container'>
          <Row>
            <Col align='center'>
                <div className='alert alert-danger' role='alert'>
                  <p>There was an error</p>
                  <p>{this.state.error}</p>
                  <Button type='info'>Report bug</Button>
                  <Button type='secondary' onClick={() => {
                    // Remove the error
                    this.setState({ error: null });
                  }}>Dismiss</Button>
                </div>
            </Col>
          </Row>
        </div>}
        {/* This renders the active nav programatically */}
        { this.renderActiveNav(this.state.navs, {
          character: this.state.character,
          user: this.state.user,
        })}
        <Modal />
      </ErrorBoundary>
      <DebugFooter />
    </div>;
  }
}
