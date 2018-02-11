import { Row, Col, RadioChoices } from '../components/Core';
import NavigationWindow from '../components/NavigationWindow';
import User from '../lib/User';
import Action from '../lib/Action';

export default class NewCharacterView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: props.user,
    };
  }

  render() {
    return <NavigationWindow
      title='New Character'>
      <Row>
        <Col>
          <div className="form-group">
            <label htmlFor="newcharactername">Name your hero</label>
            <input type="text" className="form-control" id="newcharactername"/>
          </div>
        </Col>
      </Row>
      <Row>
        <Col align='center'><button className="btn btn-success">Create</button></Col>
      </Row>
    </NavigationWindow>;
  }
}
