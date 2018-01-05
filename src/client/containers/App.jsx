
import Character from '../lib/Character';

import Navigation from '../components/Navigation';
import DebugFooter from '../components/DebugFooter';
import Loading from '../components/Loading';
import Modal from '../components/Modal';

import AdvancementView from '../containers/AdvancementView';
import WorldView from '../containers/WorldView';
import CombatView from '../containers/CombatView';
import InventoryView from '../containers/InventoryView';

export class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      character: null,
      navs: [{
        name: 'Advancement',
        icon: 'level-up',
        component: AdvancementView,
      }, {
        name: 'World',
        icon: 'map-o',
        component: WorldView,
      }, {
        name: 'Inventory',
        icon: 'flask',
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
      //}, {
      //  name: 'Options',
      //  icon: 'gear',
      }],
    };

    this.onSelectNav = this.onSelectNav.bind(this);
    this.onCharacterLoad = this.onCharacterLoad.bind(this);
  }

  onSelectNav( selectedNav ) {
    this.setState( prevState => {
      return {
        navs: prevState.navs.map( nav => {
          if ( selectedNav.name === nav.name ) {
            nav.isSelected = true;
          }
          else {
            nav.isSelected = false;
          }
          return nav;
        }),
      };
    });
  }

  onCharacterLoad(character) {
    console.log(`Loaded character ${character.name}`);

    character.onChange = () => {
      character.save().then( character => {
        this.onCharacterLoad( character );
      });
    }

    this.setState({
      character: character,
    });
  }

  componentDidMount() {
    this.onSelectNav(this.state.navs[0]);
    Character.load(1).then( character => {
      this.onCharacterLoad(character);
    });
  }

  renderActiveNav(navs, props) {
    const activeNav = navs.find( nav => nav.isSelected );
    if( !activeNav || !props.character ) {
      return <Loading/>;
    }
    if ( !activeNav.component ) {
      console.warn(`Naviation ${activeNav.name} has no component`)
      return null;
    }

    return React.createElement(activeNav.component, props, null)
  }

  render() {
    const windowProps = {
      character: this.state.character,
    };
    return <div id="page">
      <Navigation navs={this.state.navs} onSelectNav={this.onSelectNav}/>
      { this.renderActiveNav(this.state.navs, windowProps)}
      <DebugFooter />
      <Modal />
    </div>;
  }
}
