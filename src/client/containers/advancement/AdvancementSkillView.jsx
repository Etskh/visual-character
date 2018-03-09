import PropTypes from 'prop-types';
import { SKILLS } from '../../lib/constants';
import AdvancementSection from '../Section';
import { Row, Col, Button } from '../../components/Core';

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
    this.onSave = this.onSave.bind(this);
    this.renderSkill = this.renderSkill.bind(this);
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

  onSave() {
    this.props.character.addSkillPoints(this.state.spentPoints, this.props.choice.reason)
    .then(character => {
      this.props.onSelect(character);
    });
  }

  renderSkill(skill, character) {
    const skillPoints = this.state.spentPoints[skill.name] || 0;
    const characterLevel = this.props.character.get('level');
    const currentBonus = this.props.character.get('skill_' + skill.name) + skillPoints;
    const isModified = skillPoints ? true : false;
    return <Row key={skill.name} style={{
      marginTop: 2,
    }}>
      <Col size={6}>{skill.name}</Col>
      <Col size={3} align='center' className={isModified ? 'text-success' : ''}>
        {(currentBonus >= 0 ? '+' : '') + currentBonus }
      </Col>
      <Col size={3} align='center'>
        <Button
          type='primary'
          style={{margin: 0}}
          disabled={this.state.remaining===0 || skillPoints === characterLevel}
          onClick={() => {
            this.addPoint(skill.name);
          }}>
          <i className="fa fa-plus" aria-hidden="true"></i>
        </Button>
        <Button
          type='primary'
          style={{margin: 0}}
          disabled={skillPoints===0}
          onClick={() => {
            this.subPoint(skill.name);
          }}>
          <i className="fa fa-minus" aria-hidden="true"></i>
        </Button>
      </Col>
    </Row>;
  }

  render() {
    return <div>
      <Row spacing={2}>
        <Col>
          {/* TODO: translator, use t('point', count) */}
          <p>You can only add a maximum of {this.props.character.get('level')} (character level) points per skill.</p>
        </Col>
      </Row>
      <Row style={{
        fontSize: '120%',
      }}>
        <Col size={6}>Skill</Col>
        <Col size={3} align='center'>Bonus</Col>
        <Col size={3} align='center'>
          <h3>{this.state.remaining}</h3>
        </Col>
      </Row>
      {SKILLS.map( skill => this.renderSkill(skill))}
      <Row spacing={1}>
        <Col>
          <Button size='large' type='success' onClick={this.onSave}>Save</Button>
        </Col>
      </Row>
    </div>;
  }
}

AdvancementSkillView.propTypes = {
  character: PropTypes.object.isRequired,
  choice: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
};
