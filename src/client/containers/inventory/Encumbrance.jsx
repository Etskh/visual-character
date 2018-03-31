// Lib
import { getEncumbranceBracket, ENCUMBRANCE } from '../../lib/constants';
// Components
import { Row, Col, Button, } from '../../components/Core';
import Modal from '../../components/Modal';


function EncumbranceBar(which, encumbrancePercentage) {
  const style = {
    width: '33%',
    height: '100%',
    display: 'inline-block',
    color: 'white',
    textAlign: 'center',
    paddingTop: 3,
  };

  switch(which) {
  case 'light':
    style.background = '#1dd153';
    break;
  case 'medium':
    style.background = encumbrancePercentage > 1 ? '#e1d31d' : '#BBB';
    break;
  case 'heavy':
    style.background = encumbrancePercentage > 2 ? '#d1531d' : '#BBB';
    break;
  }
  return <div style={style}></div>
}

function EncumbranceBracketData(data) {
  return <table style={{
    width: '100%',
  }}>
    <tbody>
      {Object.keys(data).map( stat => {
        return <tr key={stat}>
          <td>{stat}</td>
          <td>{data[stat]}</td>
        </tr>
      })}
    </tbody>
  </table>
}


function EncumbranceInfo(currentBracket, character, translator) {
  const lightLoad = character.get('light_load');

  return <div>
    {ENCUMBRANCE.map( bracket => {
      // If there's a max, say "x to y"
      // If there isn't a max, say "over x"
      const weightRange = bracket.light_load_max ?
        `${translator.weightRounded(lightLoad * bracket.light_load_min)} - ${translator.weightRounded(lightLoad * bracket.light_load_max)}`
        : `over ${translator.weightRounded(lightLoad * bracket.light_load_min)}`

      return <div key={bracket.name} className={`alert alert-${currentBracket.name === bracket.name?'primary':'secondary'}`}>
        <h4 className="alert-heading">{bracket.name} <small>({weightRange})</small></h4>
        {bracket.effect ?
          EncumbranceBracketData(bracket.effect.data)
          : <p>No effect from this bracket</p>}
      </div>;
    })}
  </div>
}

// TODO: move this to its own component file
function LoadMeter(encumbrancePercentage) {
  return <div style={{
    width: '100%',
    height: 30,
    overflow: 'hidden',
    position: 'relative',
  }}>
    {EncumbranceBar('light', encumbrancePercentage)}
    {EncumbranceBar('medium', encumbrancePercentage)}
    {EncumbranceBar('heavy', encumbrancePercentage)}
    <div style={{
      position: 'absolute',
      marginLeft: '-0.5em',
      bottom: 0,
      left: parseInt(100 * encumbrancePercentage / 3) + '%',
      color: 'white',
    }}><i className="fa fa-caret-down fa-2x" aria-hidden="true"></i></div>
  </div>
}

export default function EncumbranceSection(character, translator) {
  const encumbrance = character.get('current_load') / character.get('light_load');
  const bracket = getEncumbranceBracket(
    character.get('current_load'),
    character.get('light_load')
  );
  return <div>
    <Row>
      <Col>
        <Button type='info'
          onClick={() => {
            Modal.open('Encumbrance', EncumbranceInfo(bracket, character, translator));
          }}>
          {'Encumbrance: '}{bracket.name}
        </Button>
      </Col>
    </Row>
    {LoadMeter(encumbrance)}
    <Row>
      <Col>{`Carrying: ${translator.weight(character.get('current_load'))}`}</Col>
    </Row>
  </div>
}
