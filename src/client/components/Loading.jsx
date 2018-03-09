import NavigationWindow from './NavigationWindow';
import { Row, Col, } from './Core';

export default class Loading extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <NavigationWindow
      title=' '>
      <Row spacing={2}>
        <Col align='center'>
          <h3>Loading...</h3>
        </Col>
      </Row>
      <Row>
        <Col align='center'>
          <img
            src="/favicon.png"
            className='fa-spin'/>
        </Col>
      </Row>
    </NavigationWindow>;
  }
}
