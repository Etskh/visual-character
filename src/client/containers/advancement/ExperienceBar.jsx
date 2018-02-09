import { Row, Col, } from '../../components/Core';
import BarButton from '../../components/BarButton';
import Modal from '../../components/Modal';
import { getNextLevel } from '../../lib/constants';
import Action from '../../lib/Action';


function ExpContent() {
  return <Row>
    <Col align='center'>
      <label>Experience points recieved</label>
    </Col>
    <Col align='center'>
      <input id="exp" type="number" name="exp"/>
    </Col>
  </Row>;
}

export default function ExperienceBar(character) {
  const current = character.get('exp');
  const nextLevel = getNextLevel(character.get('level'));

  return <div className="btn-group" role="group" aria-label="Experience controls" style={{
    width: '100%',
  }}><BarButton
      colour='orange'
      current={current}
      total={nextLevel.exp}
      onClick={() => {
        Modal.open('Gain Exp', ExpContent(), 'Add').then( state => {
          const value = state.inputs[0].value;
          if( value ) {
            character.addExp(value).then( character => {
              console.log(character);
              Action.fire('character.change', character);
            });
          }
        });
      }}
    />
  </div>;
}
