import { Row, Col, RadioChoices } from '../components/Core';
import NavigationWindow from '../components/NavigationWindow';
import User from '../lib/User';
import Action from '../lib/Action';
import {
  WEIGHTS,
  DISTANCES,
} from '../lib/Translator';

export default class OptionsView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: props.user,
    };
  }

  render() {
    const user = this.state.user;
    return <NavigationWindow
      title='Options'>
      { user ? <div>
        <h3>Unit settings</h3>
        <Row>
          <Col>
            {RadioChoices('weight', user.settings.weight, (option) => {
              User.activeUser.saveSetting('weight', option).then( user => {
                Action.fire('user.change', user);
              });
            }, WEIGHTS)}
          </Col>
        </Row>
        <Row>
          <Col>
            {RadioChoices('distance', user.settings.distance, (option) => {
              User.activeUser.saveSetting('distance', option).then( user => {
                Action.fire('user.change', user);
              });
            }, DISTANCES )}
          </Col>
        </Row>
      </div> : null }
    </NavigationWindow>;
  }
}
