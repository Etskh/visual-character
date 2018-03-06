import { Row, Col, } from '../components/Core';
import Action from '../lib/Action';

export default function AdvancementSection(props) {
  // TODO: make sure we have title, count, and onSave

  const title = <Row>
    <Col>
      <a className="btn btn-primary" style={{
        color: 'white',
        marginRight: 12,
      }} onClick={() => {
        Action.fire('ui.selectNavigation', {
          name: 'Advancement',
        });
      }}>
        <span className="fa fa-chevron-left"></span>
        <span>Back</span>
      </a>
    </Col>
    <Col>
      <h2>{props.title}</h2>
    </Col>
    <Col align='right'>
      <h2><span className="badge badge-primary">{props.count}</span></h2>
    </Col>
  </Row>;

  return <div>
    <Row>
      <Col>{props.children}</Col>
    </Row>
    <Row style={{
      marginTop: 12,
    }}>
      <Col align='right'>
        <button className='btn btn-success'
          onClick={() => {
            props.onSave();
          }}>
          Save
        </button>
      </Col>
    </Row>
  </div>;
}
