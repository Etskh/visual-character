


export default class Navigation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      navs: props.navs,
    };

    this.renderNavButton = this.renderNavButton.bind(this);
  }

  renderNavButton(nav) {
    const itemStyle = {
      color: '#1dd153',
      textAlign: 'center',
    };
    if( nav.isSelected ) {
      itemStyle.backgroundColor = '#FFF';
      itemStyle.color = 'black';
    }

    return <li style={{margin: 0,}} className="nav-item" key={nav.name}>
      <a className="nav-link"
        style={itemStyle}
        href="#"
        onClick={() => {
          this.props.onSelectNav(nav);
        }}>
        <div className={"fa fa-3x fa-" + nav.icon} aria-hidden="true"></div>
      </a>
    </li>;
  }

  render() {
    return <nav className="navbar bg-dark navbar-dark"
      style={{
        padding: 0,
        fontWeight: 300,
      }}>
      <ul className="nav justify-content-center">
        { this.state.navs.map(this.renderNavButton) }
      </ul>
    </nav>;
  }
}
