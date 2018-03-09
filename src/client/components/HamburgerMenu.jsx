import PropTypes from 'prop-types';
import Action from '../lib/Action';
import { Row, Col, Button } from './Core';


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
      return <div key={button.title}
        style={{
          marginTop: 2,
        }}>
        <Button type='secondary' size='small'
          onClick={() => {
            self.closeMenu(self);
            Action.fire('ui.selectNavigation', {
              name: button.page,
            });
          }}>
          {button.title}
        </Button>
      </div>
    })
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
          { !this.props.character ? null :
            <h3>
              {this.props.character.name}{' '}
              <Button type='secondary'>
                <span className="fa fa-lg fa-pencil" aria-hidden="true"></span>
              </Button>
            </h3>}
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
