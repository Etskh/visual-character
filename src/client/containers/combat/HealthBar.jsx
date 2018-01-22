import { Row, Col, } from '../../components/Core';
import Modal from '../../components/Modal';
import Action from '../../lib/Action';

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
      <div className='vc-health-bar'>
        <div className='vc-health-good' style={{
          width: parseInt(100 * (current / total)) + '%',
        }}>&nbsp;</div>
        <div className='vc-health-text'>{current} / {total}</div>
      </div>
    </Row>
    <Row>
      <Col align='center'>
        <button className="btn btn-sm btn-danger"
          onClick={() => {
            Modal.open('Take Damage', DamageContent(), 'Damage').then( state => {
              const value = state.inputs[0].value;
              if( value ) {
                character.takeDamage(parseInt(value)).then( character => {
                  Action.fire('character.change', character);
                });
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
                character.heal(parseInt(value)).then( character => {
                  Action.fire('character.change', character);
                });
              }
            });
          }}>Heal</button></Col>
    </Row>
  </Col>;
}
