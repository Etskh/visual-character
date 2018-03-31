import PropTypes from 'prop-types';

import Action from '../../lib/Action';
import { itemCategories, itemTypes, } from '../../lib/Items';

import NavigationWindow from '../../components/NavigationWindow';
import { Row, Col, Button, Image, Icon, } from '../../components/Core';
import Modal from '../../components/Modal';
import EncumbranceSection from '../inventory/Encumbrance';
import InventoryItems from '../inventory/InventoryItems';


function ItemHistory(history) {
  return <Row>
    <Col>
      {history.map( (historyItem, index) => {
        return <span key={historyItem.name + index}>
          <Button style={{
              margin: 0,
            }}
            type='secondary'
            onClick={() => {
              historyItem.onSelect();
            }}>
            {historyItem.name}
          </Button>
          <Icon icon='chevron-right'/>
        </span>;
      })}
    </Col>
  </Row>;
}

function AddItemListModal(history, list, onSelect) {
  return Modal.open('Add Item', <div>
    {ItemHistory(history)}
    {list.map( item => {
      return <Row key={item.name}>
        <Col>
          <Button type='secondary' onClick={() => {
            onSelect(item);
          }}>{item.name}</Button>
        </Col>
      </Row>;
    })}
  </div>);
}

// TODO: unused
// {`Buy for ${type.cost * count} gp`}
function getAddButton(props) {
  return <Button type='success' size='large' onClick={() => {
    Action.fire('item.add', {
      type,
      count,
    });
  }}>
    <span className="fa fa-lg fa-plus" aria-hidden="true"></span>
    {'  Add Item'}
  </Button>;
}



class AddItemDetailModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Set the count to the default if it has one (like arrows, or bolts)
      count: props.type.defaultCount ? props.type.defaultCount : 1,
    };
  }

  render() {
    return <div>
      {ItemHistory(this.props.history)}
      <Row spacing={1}>
        <Col align='center'>
          <h3>{this.props.type.name}</h3>
        </Col>
      </Row>
      <Row>
        <Col>
          {this.props.type.description}
        </Col>
        <Col align='center'>
          <Image src={this.props.type.image ? this.props.type.image : '/placeholder-300x250.png'}/>
        </Col>
      </Row>
      <Row>
        {/* Genearlize this control! */}
        { !this.props.type.defaultCount ? <Col></Col> :
          <Col align='right'>
            <div style={{
              margin: '1em',
              display: 'inline-block',
            }}>
              <input type='text' defaultValue={this.state.count}/>
            </div>
            <Button type='primary'
              disabled={this.state.count===1}
              style={{
                margin: 0,
              }}
              onClick={() => {
                this.setState( prevState => {
                  return {
                    count: prevState.count - 1,
                  };
                });
              }}>-</Button>
              <Button type='primary'
                style={{
                  margin: 0,
                }}
                onClick={() => {
                  this.setState( prevState => {
                    return {
                      count: prevState.count + 1,
                    };
                  });
                }}>+</Button>
          </Col>
        }
      </Row>
    </div>;
  }

  static open(history, type, addButton) {
    return Modal.open('Add Item', <AddItemDetailModal
      history={history}
      type={type}/>, addButton.title).then(state => {
        let count = 1;
        // If we rendered the input, then get the number
        // but otherwise, it's probably just 1.
        if( state.inputs.length > 0 ) {
          count = parseInt(state.inputs[0].value);
        }
        addButton.callback(type, count);
      });
  }
}
AddItemDetailModal.propTypes = {
  history: PropTypes.array.isRequired,
  type: PropTypes.object.isRequired,
};


function ShowItem(history, type, addButton) {
  return AddItemDetailModal.open(history, type, addButton);
}

function ShowTypesOfCategory(history, category, addButton) {
  const types = itemTypes.filter( t => t.category === category.name );
  const newHistory = history.concat([{
    name: category.name,
    onSelect: () => {
      ShowTypesOfCategory(history, category, addButton);
    },
  }]);

  // If we only have one type of the item, then we need to just
  // show that type
  if( types.length === 1 ) {
    return ShowItem(newHistory, types[0], addButton);
  }

  return AddItemListModal(newHistory, types, (selectedType) => {
    ShowItem(newHistory, selectedType, addButton);
  });
}

function ShowCategories(addTitle, addAction) {

  const addButton = {
    title: addTitle === 'add' ? <span className='to_brackets'>
      <span className="fa fa-lg fa-plus" aria-hidden="true"></span>
      {'  Add Item'}
    </span> : addTitle,
    callback: addAction,
    type: addTitle === 'add' ? 'success' : 'primary',
  };

  return AddItemListModal([], itemCategories, (selectedCategory) => {
    const history = [{
      name: 'All categories',
      onSelect: () => {
        ShowCategories(addTitle, addAction);
      },
    }];
    ShowTypesOfCategory(history, selectedCategory, addButton);
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

  componentDidMount() {
    Action.subscribeAll(this, 'InventoryView', {
      'character.change': (character) => {
        this.setState({
          character,
        });
      },
    });
  }

  componentWillUnmount() {
    Action.unsubscribeAll('InventoryView');
  }

  render() {
    return <NavigationWindow
      title='Inventory'>
      <Row>
        <Col>{EncumbranceSection(this.state.character, this.state.user.translator)}</Col>
      </Row>
      <Row>
        <Col align='center'>
          <Button size='large' type='warning' onClick={() => {
            ShowCategories('add', (type, count) => {
              Action.fire('item.add', {
                type,
                count,
              })
            });
          }}>
            <span className="fa fa-lg fa-plus" aria-hidden="true"></span>
            {'  Add Item'}
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <InventoryItems
            items={this.state.character.items}
            translator={this.state.user.translator}/>
        </Col>
      </Row>
    </NavigationWindow>;
  }
}
