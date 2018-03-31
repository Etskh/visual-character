import PropTypes from 'prop-types';

// Components
import Modal from './Modal';
import { Row, Col, Button } from './Core';

// Lib
import Action from '../lib/Action';


// TODO: move this to a container, and split into smaller dumb components
// TODO Handle a null user better

export default class HamburgerMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      inactiveCharacterList: [],
    };

    Action.subscribe('HamburgerMenu', 'user.change', (user) => {
      if( user ) {
        this.setInactiveCharacters(this, user);
      }
    });
  }

  componentDidMount() {
    this.setInactiveCharacters(this, this.props.user);
  }

  setInactiveCharacters(self, user) {
    user.getInactiveCharacterList().then( characters => {
      self.setState({
        inactiveCharacterList: characters,
      });
    });
  }

  onToggle(self) {
    $('#hamburger-menu').toggle('fast', () => {
      self.setState( prevState => {

        if( prevState.isOpen ) {
          $('#hamburger-bg').fadeOut(100);
        }
        else {
          $('#hamburger-bg').fadeIn(300);
        }

        return {
          isOpen: !prevState.isOpen,
        };
      });
    });
  }

  closeMenu(self) {
    return self.onToggle(self);
  }

  renderCharacterName(self) {
    if( !self.props.character ) {
      return null;
    }

    const renderChangeName = () => {
      return <Row>
        <Col align='center'>
          <label>New name</label>
        </Col>
        <Col align='center'>
          <input id="rename-character" type="text" name="rename-character" defaultValue={self.props.character.name}/>
        </Col>
      </Row>;
    }

    return <Button size='large' type='outline-primary' onClick={() => {
      self.closeMenu(self);
      Modal.open('Rename', renderChangeName(), 'Rename').then(state => {
        const value = state.inputs[0].value;
        if( value ) {
          self.props.character.rename(value).then( character => {
            Action.fire('character.change', character);
          });
        }
      });
    }}>
      {self.props.character.name}
      {' '}
      <span className="fa fa-lg fa-pencil" aria-hidden="true"></span>
    </Button>;
  }

  renderCharacterList(self) {
    return <div id="vc-character-list">
      <Row><Col>Character List</Col></Row>
      {self.state.inactiveCharacterList.map( character => {
        return <Row key={character.name}>
          <Col>
            <Button
              type='secondary'
              onClick={() => {
                this.props.user.setActiveCharacter(character.id).then( user => {
                  self.closeMenu(self);
                  Action.fire('user.change', user);
                });
              }}>
              {character.name}
            </Button>
          </Col>
        </Row>
      })}
    </div>;
  }

  renderUserSettings(self) {
    const buttons = [{
      title: 'Options',
      page: 'Options',
    }, {
      title: 'View Changes',
      page: 'Changelog',
    }];

    return buttons.map( button => {
      return <div key={button.title}>
        <Button type='secondary' size='small'
          onClick={() => {
            self.closeMenu(self);
            Action.fire('ui.selectNavigation', {
              name: button.page,
            });
          }}>
          {button.title}
        </Button>
      </div>;
    });
  }

  render() {
    return <div style={{
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      }}>
      <div id='hamburger-bg' style={{
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        position: 'fixed',
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'none',
        zIndex: 200,
      }} onClick={() => {
        this.closeMenu(this);
      }}>&nbsp;</div>
      <div className='vs-hamburger-opener'
        style={{
          color: 'white',
          height: 50,
          top: 0,
          right: 0,
          position: 'fixed',
          zIndex: 250,
        }}>
        <Button
          type='outline-primary'
          style={{
            margin: 0,
            border: 'none',
            color: '#FFF',
          }}
          onClick={(e) => {
            // Un-focus the button when you click it
            let $button = $(e.target);
            if ( !$button.hasClass('btn')) {
              $button = $button.parent();
            }
            $button.blur();

            // And toggle the menu - we pass 'this' to change the state
            this.onToggle(this);
          }}>
            {
              this.state.isOpen
              ? <span className="fa fa-3x fa-times" aria-hidden="true"></span>
              : <span className="fa fa-3x fa-ellipsis-v" aria-hidden="true"></span>
            }
          </Button>
        </div>
        <div id="hamburger-menu"
          style={{
            display: 'none',
            position: 'fixed',
            top:50,
            right: 0,
            bottom: 0,
            zIndex: 300,
            padding: '1em',
            background: '#CCC',
          }}>
          {this.renderCharacterName(this)}
          <hr/>
          {this.renderCharacterList(this)}
          <hr/>
          <Button type='success'
            onClick={() => {
              this.closeMenu(this);
              Action.fire('ui.selectNavigation', {
                name: 'New Character',
              });
            }}>
            <span className="fa fa-plus" aria-hidden="true"></span>
            {'  New Character'}
          </Button>
          <hr/>
          {this.renderUserSettings(this)}
        </div>
    </div>;
  }
}

HamburgerMenu.propTypes = {
  character: PropTypes.object,
  user: PropTypes.object.isRequired,
};
