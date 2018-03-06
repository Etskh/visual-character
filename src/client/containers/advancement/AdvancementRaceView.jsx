
import Race from '../../lib/Race';
import { Row, Col, Button } from '../../components/Core';
import AdvancementSection from '../Section';

export default class AdvancementRaceView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRace: null,
      races: [],
    };

    this.onSave = this.onSave.bind(this);
  }

  componentDidMount() {
    Race.all().then( races => {
      this.setState({
        races,
      });
    });
  }

  onSave() {
    this.props.character.selectRace(this.state.selectedRace).then( character => {
      this.props.onSelect(character);
    });
  }

  renderRaceInfo(race) {
    return <div>
      <Row>
        <Col>
          <h3>{race.name}</h3>
          <p>{race.description}</p>
          <p>{race.stat_description}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          {/* TODO: generalize this button, and prompt the user that this
            choice is irreversible before the onClick fires */}
          <button className='btn btn-success'
            onClick={() => {
              this.onSave();
            }}>
            Select
          </button>
        </Col>
      </Row>
    </div>
  }

  render() {
    return <div>
      <p>The choice of race determines what your character is inheritly good at.</p>
      <Row>
        <Col style={{
          overflow: 'scroll-y',
        }}>
          {this.state.races.map(race => {
            const isSelected = this.state.selectedRace && race.name === this.state.selectedRace.name;
            return <div key={race.name}
              className={`btn btn-sm btn-${isSelected?'info':'secondary'}`}
              onClick={() => {
                this.setState({
                  selectedRace: race,
                });
              }}
              style={{
                width: '100%',
              }}>
              {race.name}
            </div>
          })}
        </Col>
        <Col>
          {this.state.selectedRace ?
            this.renderRaceInfo(this.state.selectedRace) :
            <p>Select a race to view details.</p>
          }
        </Col>
      </Row>
    </div>;
  }
}
