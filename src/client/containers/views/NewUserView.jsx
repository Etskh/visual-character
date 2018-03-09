import { Row, Col, Button } from '../../components/Core';
import NavigationWindow from '../../components/NavigationWindow';
import User from '../../lib/User';
import Action from '../../lib/Action';

export default class NewCharacterView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isWorking: false,
      isErrored: false,
    }
  }

  componentDidMount() {
    Action.subscribeAll(this, 'NewUserView', {
      'user.login.failure': this.onUserLoginFail,
    });
  }

  componentWillUnmount() {
    Action.unsubscribeAll('NewUserView');
  }

  onUserLoginFail(err) {
    this.setState({
      isWorking: false,
      isErrored: true,
    });
  }

  onLoginClick(self) {
    self.setState({
      isWorking: true,
      isErrored: false,
    });
    Action.fire('user.login', {
      username: $('#username').val(),
      password: $('#password').val(),
    });
  }

  render() {
    return <NavigationWindow
      title={' '}>
      <Row spacing={2}>
        <Col align='center'>
          <img
            src="/favicon.png"
            className={this.state.isWorking ? 'fa-spin': ''}/>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="form-group">
            <label htmlFor="username">Username or email</label>
            <input type="text" className="form-control" id="username"/>
            <label htmlFor="newcharactername">Password</label>
            <input type="password" className="form-control" id="password"/>
          </div>
        </Col>
      </Row>
      {!this.state.isErrored ? null : <Row>
        <Col align='center'>
            <div className='alert alert-danger' role='alert'>
              <p>Password or email are incorrect</p>
              <Button type='info'>Forgot password</Button>
            </div>
        </Col>
      </Row>}
      <Row spacing={1}>
        <Col align='center'>
          <Button
            size='large'
            type='success'
            disabled={this.state.isWorking}
            onClick={() => {
              this.onLoginClick(this);
            }}>Login
          </Button>
        </Col>
      </Row>
      <Row spacing={1}>
        <Col align='center'>
          <Button
            type='info'
            disabled={this.state.isWorking}
            onClick={() => {
              // empty
            }}>Register new user
          </Button>
        </Col>
      </Row>
    </NavigationWindow>;
  }
}
