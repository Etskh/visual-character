
import { Row, Col, Button, } from '../components/Core';
import Modal from '../components/Modal';
import Stats from '../lib/Stats';

function StatInfo(stat, context) {
  return <div>
    <p>{stat.description}</p>
    <table style={{
      width: '100%',
    }}>
      <tbody>
        {stat.data.getFields().map( field => {
          const substat = Stats.get(field.name, context[field.name]);
          return <tr>
            <td>
              <Button
                type='secondary'
                disabled={!substat.description}
                >{substat.fullname}</Button>
            </td>
            <td>{field.valueGetter()}</td>
          </tr>
        })}
        <tr style={{
          fontWeight: 'bold',
        }}>
          <td style={{
            textAlign: 'right',
          }}>total</td>
          <td>{stat.data.getTotal()}</td>
        </tr>
      </tbody>
    </table>
  </div>;
}

export default class StatButton extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const props = this.props;
    const data = props.character.newData;
    const stat = Stats.get(props.stat, data[props.stat]);
    const total = stat.data.getTotal();
    return <Button
      size={props.size}
      type='info'
      onClick={() => {
        Modal.open(stat.fullname, StatInfo(stat, data));
      }}>
        {stat.name} {props.noPlus || total < 0 ? '' : '+'}{total}
    </Button>;
  }
}
