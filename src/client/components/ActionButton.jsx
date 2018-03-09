import PropTypes from 'prop-types';

// Components
import { Icon, Row, Col, Button, } from '../components/Core';
import Modal from '../components/Modal';
import { StatInfo } from '../components/StatButton';

// Lib
import Stats from '../lib/Stats';


export function ActionModal(action, character) {
  return <div>
    <Row style={{ marginBottom: 16,}}>
      <Col>{action.description}</Col>
    </Row>
    {action.blocks ? action.blocks.map( block => {
      const cols = [];
      const alignMiddle = {
        width: '50%',
        height: '50%',
        overflow: 'visible',
        margin: 'auto',
        position: 'absolute',
        top: 0, left: 0, bottom: 0, right: 0,
      };
      const huge = {
        fontWeight: 'bold',
        fontSize: '150%',
        lineHeight: 1,
      };
      const blockClasses = {
        'roll': 'outline-primary',
        'success': 'success',
        'failure': 'primary',
      };
      const blockTypes = {
        'roll': () => {
          const total = character.get(action.stat);
          return <Row>
            <Col align='center' size={{
              mobile: 12,
              desktop: 5,
            }}>
              <Button type='outline-info'
                onClick={() => {
                  const stat = Stats.get(action.stat, character.data[action.stat]);
                  Modal.open(stat.fullname, StatInfo(stat, character.data));
                }}>
                <Icon icon='1d20' size={3}/>
                <span style={huge}>{total >= 0 ? ' +' : ' ' }{total}</span>
              </Button>
            </Col>
            <Col align='center' size={{
              mobile: 12,
              desktop: 2,
            }} style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
              <small>against</small>
            </Col>
            <Col align='center' size={{
              mobile: 12,
              desktop: 5,
            }}>
              <Button type='outline-warning'>
                <span style={huge}>{block.target}</span>
                <br/>{ block.isTargetSecret ? '(done in secret)' : '' }
              </Button>
            </Col>
          </Row>;
        },
        'success': () => {
          return <span>{block.text}</span>;
        },
        'failure': () => {
          return <span>{block.text}</span>;
        },
      };

      return <div key={block.type}>
        <div
          className={`alert alert-${blockClasses[block.type]}`}>
          <h6>{block.type}</h6>
          {blockTypes[block.type]()}
        </div>
      </div>
    }) : null }
  </div>;
}


export default function ActionButton(props) {
  const total = props.character.get(props.action.stat);

  const icons = {
    'conversation': 'comment-o',
    'reaction': 'exclamation-circle',
    'move': 'long-arrow-right',
    'ranged': 'bullseye',
  };

  const getDurationBar = () => {
    if( !props.action.duration ) {
      return null;
    }

    if (props.action.duration === 'move') {
      return <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: 5,
        width: '50%',
        backgroundColor: '#55FF77',
      }}>&nbsp;</div>
    }

    console.warn(`Unknown action duration ${props.action.duration}`);
    return null;
  }

  return <Button
    size='large'
    type='primary'
    style={{position:'relative'}}
    onClick={() => {
      const title = <span>
        {props.action.name}
        <br/>
        <small>(<Icon colour='black' icon={icons[props.action.type]}/> {props.action.type})</small>
      </span>;
      Modal.open(title, ActionModal(props.action, props.character));
    }}>
    {getDurationBar()}
    <Row>
      <Col>
        <Icon size={2} icon={icons[props.action.type]}/>
        {'   '}{props.action.name}
      </Col>
      <Col>{`${total >= 0 ? '+' : ''} ${total}`}</Col>
    </Row>
  </Button>;
}


ActionButton.propTypes = {
  character: PropTypes.object.isRequired,
  action: PropTypes.object.isRequired,
};
