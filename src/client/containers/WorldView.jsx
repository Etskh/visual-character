import NavigationWindow from '../components/NavigationWindow';
import ActionList from '../components/ActionList';

export default class WorldView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <NavigationWindow
      title='World'>
      <ActionList
        character={this.props.character}
        when='world'/>
    </NavigationWindow>;
  }
}
