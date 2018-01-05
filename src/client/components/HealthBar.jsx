import { Row, Col, } from '../components/Core';
import Modal from '../components/Modal';

function HealContent() {
  return <Row>
    <Col align='center'>
      <label>Damage healed</label>
    </Col>
    <Col align='center'>
      <input id="damage" type="number" name="damage"/>
    </Col>
  </Row>;
}

function DamageContent() {
  return <Row>
    <Col align='center'>
      <label>Damage taken</label>
    </Col>
    <Col align='center'>
      <input id="damage" type="number" name="damage"/>
    </Col>
  </Row>;
}



export default function HealthBarColumn(character) {
  const total = character.get('total_hp');
  const current = character.get('hitpoints');

  return <Col>
    <Row><h3>Health</h3></Row>
    <Row>
      <div style={{
        position: 'relative',
        color: 'white',
        textShadow: '#000 1px 1px 3px',
        background: '#999',
        width: '100%',
        textAlign: 'center',
        height: '2em',
        margin: 4,
      }}>
        <div style={{
          top: 0,
          position: 'absolute',
          width: parseInt(100 * (current / total)) + '%',
          height: '100%',
          background: '#F66',
        }}>&nbsp;</div>
        <div style={{
          top: 0,
          position: 'absolute',
          width: '100%',
          height: '100%',
          paddingTop: 3,
        }}>{current} / {total}</div>
      </div>
    </Row>
    <Row>
      <Col align='center'>
        <button className="btn btn-sm btn-danger"
          onClick={() => {
            Modal.open('Take Damage', DamageContent(), 'Damage').then( state => {
              const value = state.inputs[0].value;
              if( value ) {
                character.takeDamage(parseInt(value));
              }
            });
          }}>Damage</button>
        </Col>
      <Col align='center'>
        <button className="btn btn-sm btn-success"
          onClick={() => {
            Modal.open('Heal', HealContent(), 'Heal').then( state => {
              const value = state.inputs[0].value;
              if( value ) {
                character.heal(parseInt(value));
              }
            });
          }}>Heal</button></Col>
    </Row>
  </Col>;
}
