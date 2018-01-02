import NavigationWindow from '../components/NavigationWindow';
import { Row, Col } from '../components/Core';
import { getEncumbranceBracket, ENCUMBRANCE } from '../lib/constants';
import Translation from '../lib/Translation';
import { itemCategories } from '../lib/Items';
import Modal from '../components/Modal';

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

function EncunbranceBracketData(data) {
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


function EncumbranceInfo(currentBracket, character) {
  const lightLoad = character.get('light_load');

  return <div>
    {ENCUMBRANCE.map( bracket => {
      // If there's a max, say "x to y"
      // If there isn't a max, say "over x"
      const weightRange = bracket.light_load_max ?
        `${Translation.weight(lightLoad * bracket.light_load_min)} - ${Translation.weight(lightLoad * bracket.light_load_max)}`
        : `over ${Translation.weight(lightLoad * bracket.light_load_min)}`

      return <div key={bracket.name} style={{
          marginTop: 10,
          background: currentBracket.name === bracket.name ? '#8ccbf7' : 'transparent',
        }}>
        <Row>
          <Col align='center'><h6>{bracket.name}</h6></Col>
        </Row>
        <Row>
          <Col>{weightRange}</Col>
          <Col>{bracket.effect ?
            EncunbranceBracketData(bracket.effect.data)
            : 'No effect from this bracket'}</Col>
        </Row>
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
      bottom: 0,
      left: parseInt(100 * encumbrancePercentage / 3) + '%',
      color: 'white',
    }}><i className="fa fa-map-pin fa-2x" aria-hidden="true"></i></div>
  </div>
}


// TODO: move this to its own component file
function InventoryItem(item, isEven, children) {
  if( !children ) {
    children = [];
  }
  return <div key={item.key} style={{
    background: isEven ? '#CDC' : '#FFF',
    padding: 5,
  }}>
    <Row>
      <Col>
        {`${item.count>1 ? item.count:''} ${Translation.get(item.name, item.count)}`}
      </Col>
      {children.map( child => {
        return <Col key={child.toString()}>{child}</Col>;
      })}
      <Col align='right'>
        {Translation.weight(item.weight * item.count)}
      </Col>
    </Row>
  </div>
}

function WeaponItem(item, isEven) {
  const crit = (item.itemType.data.critRange > 1 ?
    (21 - item.itemType.data.critRange) + '-' : ''
    ) + '20';

  return InventoryItem(item, isEven, [
    item.itemType.data.dice, // 1d10
    `${crit} x${item.itemType.data.critMult}`, // 19-20 x2
  ]);
}

function WealthItem(item, isEven, ) {
  return InventoryItem(item, isEven, [
    `worth ${item.count * item.data.cost.total} gp`,
  ]);
}


function InventoryItems(items) {
  // Arrange the items into collapsable sections
  const sections = [{
    name: 'Weapons',
    category: 'weapon',
    collapsed: false,
    itemFunction: WeaponItem,
    extraCol: null,
  }, {
    name: 'Wealth',
    category: 'wealth',
    collapsed: true,
    itemFunction: WealthItem,
    extraCol: 'cost',
  }];

  sections.forEach( section => {
    section.items = items.filter(i => i.category.name === section.category);
  });

  const categoriesLeft = itemCategories.map(c => c.name).filter( c => {
    // If the category isn't in the sections, then include it!
    // ['weapon'].indexOf('spellbook') === -1
    return sections.map( s => s.category).indexOf(c) === -1;
  });
  sections.push({
    name: 'Miscellaneous',
    collapsed: false,
    extraCol: null,
    itemFunction: InventoryItem,
    // Grab the items that fell into our catch
    items: items.filter(i => categoriesLeft.indexOf(i.category.name) !== -1),
  });

  return sections.map( section => {
    // TODO: this should be its own object
    let index = 0;
    const combinedWeight = section.items.reduce( (acc, cur) => {
      return acc + (cur.count * cur.weight);
    }, 0);
    return <div key={section.name}
      style={{
        paddingTop: 20,
      }}>
      <Row>
        <Col>
          <button className='btn btn-secondary' style={{}} onClick={()=> {
            // Toggle contents of this section
            $(`#section-${section.name}`).toggle('fast');
          }}>
            <h5 style={{marginBottom: 0}}>
              {section.collapsed ?
                <i className="fa fa-plus-square-o" aria-hidden="true"></i>
                : <i className="fa fa-minus-square-o" aria-hidden="true"></i>
              }
              {section.name}
            </h5>
          </button>
        </Col>
        {section.extraCol ? <Col>
          {`Total value ${section.items.reduce((acc,cur) => {
            return acc + cur.data.cost.total * cur.count;
          }, 0)}gp`}
        </Col> : null }
        <Col align='right'>
          total {Translation.weight(combinedWeight)}
        </Col>
      </Row>
      <div id={`section-${section.name}`}
        style={{
          display: section.collapsed ? 'none' : 'block',
        }}>
        {section.items.map(item => {
          return section.itemFunction(item, (++index % 2 !== 0));
        })}
      </div>
    </div>;
  });

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

    return <NavigationWindow
      title='Inventory'>
      <Row>
        <Col>
          {'Encumbrance: '}
          <button className='btn btn-primary btn-sm'
            onClick={() => {
              Modal.open('Encumbrance', 'OK', EncumbranceInfo(bracket, this.props.character));
            }}>{bracket.name}</button>
        </Col>
      </Row>
      {LoadMeter(encumbrance)}
      <Row>
        <Col>{`Carrying: ${Translation.weight(parseInt(this.props.character.get('current_load') * 100) /100 )}`}</Col>
      </Row>
      <Row>
        <Col>
          {InventoryItems(this.props.character.items)}
        </Col>
      </Row>
    </NavigationWindow>;
  }
}
