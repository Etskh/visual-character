import NavigationWindow from '../components/NavigationWindow';
import { Row, Col, } from '../components/Core';
import ExperienceBar from './advancement/ExperienceBar';
import AdvancementSkillView from './advancement/AdvancementSkillView';
import { getNextLevel } from '../lib/constants';



export default class AdvancementView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const character = this.props.character;
    // Get choices where the decision isn't made
    const outstandingChoices = character.choices.filter( choice => {
      return !choice.decision || (choice.type === 'skill' && !choice.target);
    });
    const nextLevel = getNextLevel(character.get('level'));
    const className = character.choices.filter( choice => (
      choice.type === 'class'
    )).reduce( (acc, cur) => {
      // [].indexOf('wizard') -> ['wizard']
      if( acc.indexOf(cur.decision) === -1) {
        acc.push(cur.decision);
      }
      return acc;
    }, []).join('/'); // Wizard/Barbarian

    const sectionViews = {
      'skill': AdvancementSkillView,
    };

    return <NavigationWindow
      title='Advancement'>
      <Row>
        <Col><h3>{character.name} the level {character.get('level')} {className}</h3></Col>
      </Row>
      <Row>
        <Col>{ExperienceBar(character.get('exp'), nextLevel.exp)}</Col>
      </Row>
      {
        // If there are no choices
        outstandingChoices.length === 0 ?
        <Row>
          <Col>
            <div className="alert alert-success">
              No outstanding choices remain
            </div>
          </Col>
        </Row>
        // If there are choices
        : outstandingChoices.map( choice => {
          if ( !sectionViews[choice.type] ) {
            return <div key={choice.type}>No sectionView for {choice.type}</div>
          }
          return <div key={choice.type}>
            {React.createElement(sectionViews[choice.type], {
              character,
              choice,
            }, null)}
          </div>;
        })
      }
    </NavigationWindow>;
  }
}
