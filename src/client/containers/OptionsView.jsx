import { Row, Col, RadioChoices } from '../components/Core';
import NavigationWindow from '../components/NavigationWindow';
import User from '../lib/User';
import Translation from '../lib/Translation';

export default class OptionsView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const user = User.activeUser;
    console.log(user);
    return <NavigationWindow
      title='Options'>
      { user ? <div>
        <h3>Unit settings</h3>
        <Row>
          <Col>
            {RadioChoices('weight', user.settings.weight, (option) => {
              User.activeUser.saveSetting('weight', option).then( user => {
                user.onChange();
              });
              Translation.setWeightUnit(option);
            }, Translation.WEIGHTS)}
          </Col>
        </Row>
        <Row>
          <Col>
            {RadioChoices('distance', user.settings.distance, (option) => {
              User.activeUser.saveSetting('distance', option);
              Translation.setDistanceUnit(option);
            }, Translation.DISTANCES )}
          </Col>
        </Row>
      </div> : null }
    </NavigationWindow>;
  }
}
