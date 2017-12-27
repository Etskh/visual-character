import NavigationWindow from '../components/NavigationWindow';
import { Row, Col } from '../components/Core';
import { getEncumbranceBracket } from '../lib/constants';
import Translation from '../lib/Translation';

// TODO: move this to its own component file
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
      bottom: 0,
      left: parseInt(100 * encumbrancePercentage / 3) + '%',
      color: 'white',
    }}><i className="fa fa-map-pin fa-2x" aria-hidden="true"></i></div>
  </div>
}

function ItemExtraInfo(item) {
  if ( item.category.name === 'weapon' ) {
    // simple mace | 1 - 8 damage | 19-20 x2
    const crit = (item.data.critRange > 1 ?
      (21 - item.data.critRange) + '-' : ''
      ) + '20';

    console.log(item);

    return <Row>
      <Col>{`${item.data.complexity} ${item.data.type}`}</Col>
      <Col>{`${item.data.dice}`}</Col>
      <Col>{`${crit}x${item.data.critMult}`}</Col>
    </Row>;
  }

  // No extra processing required for these types
  if ( ['ammunition'].indexOf(item.category.name) !== -1 ) {
    return null;
  }

  console.error(`Unknown category name for list rendering: ${item.category.name}`);
  return null;
}

// TODO: move this to its own component file
function InventoryItem(item, isEven) {
  return <div key={item.key} style={{
    background: isEven ? '#CFC' : '#FFF',
  }}>
    <Row>
      <Col>
        <button className='btn btn-primary btn-sm'>
          {`${item.count>1 ? item.count:''} ${Translation.get(item.name, item.count)}`}
        </button>
      </Col>
      <Col>{item.category.name}</Col>
      <Col>{Translation.weight(item.itemType.weight * item.count)}</Col>
    </Row>
    <div style={{
      padding: 5,
    }}>{ItemExtraInfo(item)}</div>
  </div>
}


export default class InventoryView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const encumbrance = this.props.character.get('current_load') / this.props.character.get('light_load');
    const bracket = getEncumbranceBracket(
      this.props.character.get('current_load'),
      this.props.character.get('light_load')
    );
    let index = 0;

    return <NavigationWindow
      title='Inventory'>
      <Row>{`Encumbrance: ${bracket.name}`}</Row>
      {LoadMeter(encumbrance)}
      {this.props.character.items.map(item => {
        return InventoryItem(item, (++index % 2 === 0));
      })}
    </NavigationWindow>;
  }
}
