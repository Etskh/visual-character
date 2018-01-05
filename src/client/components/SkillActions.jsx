import { Row, Col } from './Core';
// TODO: make this action button
import StatButton from './StatButton';
import { SKILLS } from '../lib/constants';


export default class SkillActions extends React.Component {
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
    const actionList = [];
    SKILLS.forEach( skill => {
      if ( !skill.actions ) return;
      skill.actions.forEach( action => {
        if( action.when === when ) {
          action.skill = skill;
          actionList.push(action);
        }
      });
    });

    return <Row>
      <Col>{actionList.map( action => {
        return <StatButton
          name={action.name}
          stat={`skill_${action.skill.name}`}
          character={character}
          key={action.name}
        />;
      })}</Col>
    </Row>;
  }
}
