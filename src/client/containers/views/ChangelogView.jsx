import NavigationWindow from '../../components/NavigationWindow';
import { Row, Col } from '../../components/Core';

export default class ChangelogView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const builds = [{
      version: '0.0.10',
      released: 'March 2018',
      build: 'rc-300',
      features: [
        'Can choose from core classes',
        'App needs sign-in to access user info',
        'Made menu transitions more stable',
        'Can switch between user characters from hamburger',
        'Can sign in and sign out',
      ],
    }, {
      version: '0.0.9',
      released: 'March 2018',
      build: 'rc-210',
      features: [
        'New character button to create new character',
        'Added hamburger menu to view user info',
        'Added Changelog with changes',
        'Can choose from core races',
        'Can assign stats to new characters',
        'Can choose from core races',
        'Added all core classes',
        'Moved user options to hamburger menu',
      ],
    }, {
      version: '0.0.0 - 0.0.8',
      released: 'Before March 2018',
      build: '-',
      features: [
        'No feature information available',
      ],
    }]

    return <NavigationWindow
      title='Changes'>
      {builds.map( build => {
        let featureNum = 0;
        return <Row spacing={2} key={build.version}>
          <Col>
            <h3>{build.version}: <small>{build.released}</small></h3>
            <h4>Features</h4>
            <ul>
              {build.features.map( feature => <li key={++featureNum}>{feature}</li>)}
            </ul>
            <div>build: {build.build}</div>
          </Col>
        </Row>
      })}
    </NavigationWindow>;
  }
}
