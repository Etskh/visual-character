import { Row, Col } from './Core';
import ActionButton from './ActionButton';
import { SKILLS } from '../lib/constants';


export default class ActionList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      when: this.props.when,
      character: this.props.character,
    };
  }

  render() {
    const character = this.state.character;
    const when = this.state.when;
    return <Row>
      <Col>
        {character.actions.map( action => {
          return action.when !== when ? null : <ActionButton
            action={action}
            character={character}
            key={action.name}
          />
        })}
      </Col>
    </Row>
  }
}
