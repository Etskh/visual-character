import Action from '../lib/Action';

export default class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navs: props.navs,
    };
  }

  renderNavButton(nav) {
    return <li key={nav.name} className={`nav-item vc-nav-item`}>
      <a className={`nav-link ${nav.isDisabled?'disabled':''} ${nav.isSelected?'selected':''}`}
        href="#"
        onClick={() => {
          if ( !nav.isSelected ) {
            Action.fire('ui.selectNavigation', nav);
          }
        }}>
        <div className={"fa fa-3x fa-" + nav.icon} aria-hidden="true"></div>
      </a>
    </li>;
  }

  render() {
    return <nav className="navbar bg-dark navbar-dark vc-nav">
      <ul className="nav justify-content-center">
        { this.state.navs.map(this.renderNavButton) }
      </ul>
    </nav>;
  }
}
