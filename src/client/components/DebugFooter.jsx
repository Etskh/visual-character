const pkg = require('../../../package');

import { Row, Col, } from './Core';


export default class DebugFooter extends React.Component {
  render() {
    return <div className="container">
      <Row>
        <Col>{`Screen size: (${window.innerWidth}x${window.innerHeight})`}</Col>
      </Row>
      <Row>
        <Col><img src="/favicon.png" width={32} height={32}/></Col>
        <Col>{`Version: ${pkg.version}`}</Col>
      </Row>
    </div>;
  }
}
