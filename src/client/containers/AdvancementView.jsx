import NavigationWindow from '../components/NavigationWindow';
import SkillActions from '../components/SkillActions';
import { Row, Col } from '../components/Core';
import { SKILLS, getNextLevel } from '../lib/constants';

function AdvancementSection(props) {
  // TODO: make sure we have title, count, and onSave

  return <div>
    <Row>
      <Col>
        <h2>{props.title}</h2>
      </Col>
      <Col align='right'>
        <h2><span className="badge badge-primary">{props.count}</span></h2>
      </Col>
    </Row>
    <Row>
      <Col>{props.children}</Col>
    </Row>
    <Row style={{
      marginTop: 12,
    }}>
      <Col align='right'>
        <button className='btn btn-success'
          onClick={() => {
            props.onSave();
          }}>
          Save
        </button>
      </Col>
    </Row>
  </div>;
}

export class AdvancementSkillView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      spentPoints: {},
      remaining: parseInt(props.choice.decision, 10),
    }

    this.addPoint = this.addPoint.bind(this);
    this.subPoint = this.subPoint.bind(this);
    this.changePoint = this.changePoint.bind(this);
    this.save = this.save.bind(this);
  }

  addPoint(skillName) {
    if( this.state.remaining > 0) {
      return this.changePoint(skillName, 1);
    }
  }

  subPoint(skillName) {
    if ( this.state.spentPoints[skillName] > 0) {
      return this.changePoint(skillName, -1);
    }
  }

  changePoint(skillName, delta) {
    this.setState( prevState => {
      const spent = Object.assign({}, prevState.spentPoints);
      spent[skillName] = (prevState.spentPoints[skillName] || 0) + delta;
      return {
        spentPoints: spent,
        remaining: prevState.remaining - delta,
      };
    });
  }

  save() {
    /*console.log(this.state.spentPoints);
    */
    this.props.character.addSkillPoints(this.state.spentPoints);
  }

  render() {
    const character = this.props.character;
    const addPoint = this.addPoint;
    const subPoint = this.subPoint;
    const spentPoints = this.state.spentPoints;
    const remainingPoints = this.state.remaining;
    return <AdvancementSection
      title={`Skill Points`}
      count={remainingPoints}
      onSave={this.save}>
      <p>You can only add a maximum of [character.level] points per skill.</p>
      <table style={{
        width: '100%',
      }}>
        <thead style={{
          fontWeight: 'bold',
        }}>
          <tr>
            <td>Name</td>
            <td>Stat</td>
            <td>Bonus</td>
            <td></td>
            <td></td>
          </tr>
        </thead>
        <tbody>{SKILLS.map( skill => {
          // TODO: pull out into function
          const skillPoints = spentPoints[skill.name] || 0;
          return <tr key={skill.name}>
            <td>{skill.name}</td>
            <td>{skill.stat}</td>
            <td>{character.newData['skill_' + skill.name].getTotal()}</td>
            <td className='text-success'>
              {skillPoints ? `+ ${skillPoints}` : null}
            </td>
            <td><button
              className={['btn btn-primary btn-sm', remainingPoints===0 ? 'disabled' : ''].join(' ')}
              onClick={() => {
                addPoint(skill.name);
              }}>
              <i className="fa fa-plus" aria-hidden="true"></i>
            </button><button className={['btn btn-primary btn-sm', skillPoints===0 ? 'disabled' : ''].join(' ')}
              onClick={() => {
                subPoint(skill.name);
              }}>
              <i className="fa fa-minus" aria-hidden="true"></i>
            </button></td>
          </tr>
        })}</tbody>
      </table>
    </AdvancementSection>;
  }
}


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
        <Col>{character.name} the level {character.get('level')} {className}</Col>
        <Col>Experience: {character.get('exp')} / {nextLevel.exp}</Col>
      </Row>
      <Row>
        <Col>Experience bar should go here</Col>
      </Row>
      {
        // If there are no choices
        outstandingChoices.length === 0 ?
        <Row><Col>No outstanding choices remain</Col></Row>
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
