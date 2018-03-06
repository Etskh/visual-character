
import { STATS } from '../../lib/constants';
import Stats from '../../lib/Stats';
import { Row, Col, Button } from '../../components/Core';
import AdvancementSection from '../Section';

export default class AdvancementBaseStat extends React.Component {
  constructor(props) {
    // TODO: make this a walk-through of the different types of dice-rolls
    // TODO: choose the method: roll 4 use 3, use 3, point-buy,
    // TODO: then let the player choose one. They enter in all their rolls
    super(props);

    this.state = {
      // empty
    };

    this.onSave = this.onSave.bind(this);
  }

  onSave() {
    const statValues = {};
    STATS.forEach( statName => {
      // TODO: use control references instead
      const statValue = $(`#stat_${statName}`).val();
      statValues[statName] = statValue;
    });
    this.props.character.setBaseScores(statValues).then( character => {
      this.props.onSelect(character);
    });
  }

  renderNumberSelect(id) {
    // numbers = [ 3, 4, 5, ... 17, 18];
    const numbers = Object.keys(Array.from(Array(16)))
      .map( key => parseInt(key, 10) + 3); // 3 - 18

    return <select id={id} className="form-control form-control-sm vc-base-stat">
      {numbers.map( number => {
        return <option key={number} value={number}>{number}</option>;
      })}
    </select>;
  }

  render() {
    const stats = Stats.getBaseDescriptions();

    return <AdvancementSection onSave={this.onSave}>
      <p>Abilty scores represent a characters' basic attributes. Ask your GM how to determine the values of each, then enter them here.</p>
      {stats.map( stat => {
        return <div key={stat.name} className='container'>
          <Row>
            <Col size={6}><h5>{stat.fullname}</h5></Col>
            <Col size={6} align='right'>
              {this.renderNumberSelect(`stat_${stat.name}`)}
            </Col>
          </Row>
          <Row>
            <Col>{stat.description}</Col>
          </Row>
        </div>
      })}
    </AdvancementSection>;
  }
}
