import { Row, Col, } from '../../components/Core';

export default function AdvancementSection(props) {
  // TODO: make sure we have title, count, and onSave

  return <div>
    <Row>
      <Col>
        <h2>{props.title}</h2>
      </Col>
      <Col align='right'>
        <h2><span className="badge badge-primary">{props.count}</span></h2>
      </Col>
    </Row>
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
