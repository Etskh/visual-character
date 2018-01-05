
import { Row, Col, Button, } from '../components/Core';
import NavigationWindow from '../components/NavigationWindow';
import HealthBarColumn from '../components/HealthBar';
import StatButton from '../components/StatButton';
import SkillActions from '../components/SkillActions';

export default class CombatView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <NavigationWindow
      title='Combat'>
      <Row>
        <Col>
          {HealthBarColumn(this.props.character)}
        </Col>
        <Col>
          <Row><h3>Defences</h3></Row>
          <Row>
            <Col>
              <StatButton
                size='large'
                stat='ac'
                character={this.props.character}
                noPlus={true}/>
            </Col>
            <Col>
              <StatButton
                stat='fort_save'
                character={this.props.character}
              />
              <StatButton
                stat='ref_save'
                character={this.props.character}
              />
              <StatButton
                stat='will_save'
                character={this.props.character}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <h3>Combat Actions</h3>
        </Col>
      </Row><Row>
        <Col>
          <SkillActions
            character={this.props.character}
            when='combat'/>
        </Col>
      </Row>
    </NavigationWindow>;
  }
}
