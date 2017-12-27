import NavigationWindow from './NavigationWindow';

export default class Loading extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <NavigationWindow
      title='Loading'>
      <div className="row">
        <div className="col">
          <i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>
        </div>
      </div>
    </NavigationWindow>;
  }
}
