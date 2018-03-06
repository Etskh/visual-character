import Action from '../lib/Action';

export default class HamburgerMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };
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
      <div>Character List</div>
      <div>
        <button className="btn btn-secondary btn-sm disabled">
          {' Kazrah'}
        </button>
      </div>
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
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => {
            self.closeMenu(self);
            Action.fire('ui.selectNavigation', {
              name: button.page,
            });
          }}>
          {button.title}
        </button>
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
        <button
          className="btn btn-outline-primary btn-sm"
          style={{
            border:'none',
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
          </button>
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
          {this.props.character ?
            <h3>
              {this.props.character.name}
              <button className="btn btn-secondary btn-sm">
                <span className="fa fa-lg fa-pencil" aria-hidden="true"></span>
              </button>
            </h3>
            : 'Loading...'}
          <hr/>
          {this.renderCharacterList(this)}
          <hr/>
          <button className="btn btn-success btn-sm"
            onClick={() => {
              this.closeMenu(this);
              Action.fire('ui.selectNavigation', {
                name: 'New Character',
              });
            }}>
            <span className="fa fa-plus" aria-hidden="true"></span>
            {'  New Character'}
          </button>
          <hr/>
          {this.renderUserSettings(this)}
        </div>
    </div>;
  }
}
