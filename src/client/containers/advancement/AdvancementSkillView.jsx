import AdvancementSection from './Section';
import { SKILLS } from '../../lib/constants';

export default class AdvancementSkillView extends React.Component {
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
    this.props.character.addSkillPoints(this.state.spentPoints, this.props.choice.reason);
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
            <td>{character.get('skill_' + skill.name)}</td>
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
