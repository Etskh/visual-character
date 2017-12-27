import NavigationWindow from '../components/NavigationWindow';
import SkillActions from '../components/SkillActions';

export default class WorldView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <NavigationWindow
      title='World'>
      <SkillActions
        character={this.props.character}
        when='world'/>
      <p>World stuff goes in here</p>
      <p>{this.props.character.name}</p>
    </NavigationWindow>;
  }
}
