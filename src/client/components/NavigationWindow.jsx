


export default class NavigationWindow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: props.title,
    }
  }

  render() {
    return <div className="container">
      <h1>{this.state.title}</h1>
      {this.props.children}
    </div>
  }
}
