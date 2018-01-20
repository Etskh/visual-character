import NavigationWindow from '../components/NavigationWindow';
import { Row, Col } from '../components/Core';
import { itemCategories } from '../lib/Items';
import Modal from '../components/Modal';
import EncumbranceSection from './inventory/Encumbrance';

function getCritInfo(item) {
  const crit = (item.itemType.data.critRange > 1 ?
    (21 - item.itemType.data.critRange) + '-' : ''
    ) + '20';
  return `${crit} x${item.itemType.data.critMult}`
}

function WeaponDetail(translator, item) {
  /*
  data: {
    complexity: 'simple',
    dice: '1d10',
    type: 'crossbow',
    damageType: 'p',
    range: 120,
    ammunition: 'bolt',
    critRange: 2,
    critMult: 2,
    handed: 'two',
  },
  */
  const complexityDescs = {
    'simple': 'Simple weapons are usually easy to pick up and use',
    'martial': 'Marial weapons require training to use properly',
    'exotic': 'Exotic weapons are strange and uncanny, and probably require a certain culture or upbringing to use properly',
  };
  const handedDescs = {
    'light': 'This weapon is best suited as an off-hand weapon, but can be used as a main weapon in a pinch',
    'one': 'This weapon is best suited as a one-handed weapon',
    'two': 'This weapon takes two free hands to use',
  };
  const damageTypeDescs = {
    'p': 'Piercing',
    'b': 'Bludgeoning',
    's': 'Slashing or slicing',
  };
  const critMutlDescs = {
    '2': 'twice',
    '3': 'three times',
    '4': 'four times',
  };
  const critNumbers = ((range) => {
    let numbers = [];
    while( range > 1 ) {
      numbers.push(21 - range);
      range--;
    }
    return numbers;
  })(item.itemType.data.critRange);
  const criticalNumberDesc = critNumbers.length > 0
    ? critNumbers.join(', ') + ' or 20'
    : 'natural 20'

  return <div>
    <Row>
      <Col>Hands: {handedDescs[item.itemType.data.handed]}</Col>
      <Col>Complexity: {item.itemType.data.complexity}<br/> {complexityDescs[item.itemType.data.complexity]}</Col>
    </Row>
    <Row>
      <Col>Damage</Col>
      <Col>{item.itemType.data.dice}</Col>
      <Col>{damageTypeDescs[item.itemType.data.damageType]}</Col>
    </Row>
    <Row>
      {/*
      <Col>Critical chance:</Col>
      <Col>{getCritInfo(item)}</Col>
      <Col>On a {criticalNumberDesc} there's a chance to deal {critMutlDescs[item.itemType.data.critMult]} the damage.</Col>
      */}
    </Row>
    {item.itemType.data.range ? <Row>
      <Col>Range</Col>
      <Col>{translator.distance(item.itemType.data.range)}</Col>
    </Row> : null}
  </div>;
}

function ItemDetail(item) {
  const description = item.itemType.description || '[description]';
  return <div>
    <p>{description}</p>
    { item.category.name === 'weapon' ? WeaponDetail(item) : null }
  </div>;
}


// TODO: move this to its own component file
function InventoryItem(translator, item, isEven, children) {
  if( !children ) {
    children = [];
  }
  const fullname = `${item.count>1 ? item.count:''} ${translator.get(item.name, item.count)}`;

  return <div key={item.key} style={{
    background: isEven ? '#CDC' : '#FFF',
    padding: 5,
  }}>
    <Row>
      <Col>
        <button
          className='btn btn-outline-primary btn-sm'
          onClick={() => {
            Modal.open(fullname, ItemDetail(item));
          }}>
          {fullname}
        </button>
      </Col>
      {children.map( child => {
        return <Col key={child.toString()}>{child}</Col>;
      })}
      <Col align='right'>
        {translator.weight(item.weight * item.count)}
      </Col>
    </Row>
  </div>
}

function WeaponItem(translator, item, isEven) {
  return InventoryItem(translator, item, isEven, [
    item.itemType.data.dice, // 1d10
    //getCritInfo(item), // 19-20 x2
  ]);
}

function WealthItem(translator, item, isEven, ) {
  return InventoryItem(translator, item, isEven, [
    `${item.count * item.data.cost.total} gp`,
  ]);
}


function InventoryItems(items, translator) {
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
        marginTop: 20,
      }}>
      <Row>
        <Col>
          <button className='btn btn-secondary' onClick={()=> {
            // Toggle contents of this section
            // Don't bother with state - they'll thank us!
            $(`#section-${section.name}`).toggle('fast');
            $(`#toggle-open-${section.name}`).toggle();
            $(`#toggle-closed-${section.name}`).toggle();
          }}>
            <h5 style={{marginBottom: 0}}>
              <i id={`toggle-closed-${section.name}`}
                style={{
                  display: section.collapsed ? 'inline' : 'none',
                }}
                className="fa fa-chevron-right"
                aria-hidden="true"></i>
              <i id={`toggle-open-${section.name}`}
                style={{
                  display: !section.collapsed ? 'inline' : 'none',
                }}
                className="fa fa-chevron-down" aria-hidden="true"></i>
              {section.name}
            </h5>
          </button>
        </Col>
        {section.extraCol ? <Col>
          {`${section.items.reduce((acc,cur) => {
            return acc + cur.data.cost.total * cur.count;
          }, 0)} gp`}
        </Col> : null }
        <Col align='right'>
          <em>{translator.weight(combinedWeight)}</em>
        </Col>
      </Row>
      <div id={`section-${section.name}`}
        style={{
          display: section.collapsed ? 'none' : 'block',
        }}>
        {section.items.map(item => {
          return section.itemFunction(translator, item, (++index % 2 !== 0));
        })}
      </div>
    </div>;
  });

}


export default class InventoryView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      character: props.character,
      user: props.user,
    };
  }

  render() {
    return <NavigationWindow
      title='Inventory'>
      <Row>
        <Col>{EncumbranceSection(this.state.character, this.state.user.translator)}</Col>
      </Row>
      <Row>
        <Col>{InventoryItems(this.state.character.items, this.state.user.translator)}</Col>
      </Row>
    </NavigationWindow>;
  }
}
