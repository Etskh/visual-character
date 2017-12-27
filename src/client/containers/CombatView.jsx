
import { Row, Col, } from '../components/Core';
import NavigationWindow from '../components/NavigationWindow';
import HealthBarColumn from '../components/HealthBar';
import BreakdownButton from '../components/BreakdownButton';
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
              <BreakdownButton
                stat='ac'
                size='large'
                noPlus={true}
                character={this.props.character}
              />
            </Col>
            <Col>
              <BreakdownButton
                stat='fort_save'
                character={this.props.character}
              />
              <BreakdownButton
                stat='ref_save'
                character={this.props.character}
              />
              <BreakdownButton
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
