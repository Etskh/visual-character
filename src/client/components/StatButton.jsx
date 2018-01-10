
import { Row, Col, Button, } from '../components/Core';
import Modal from '../components/Modal';
import Stats from '../lib/Stats';

export function StatInfo(stat, context) {
  return <div>
    <p>{stat.description}</p>
    { stat.hideFields ? null :
    <table style={{
      width: '100%',
    }}>
      <tbody>
        {stat.data.getFields().map( field => {
          const substat = Stats.get(field.name, context[field.name]);
          const alias = substat.alias ?
            Stats.get(substat.alias, context[substat.alias]) : null;
          // do not allow a link if there is no description or alias
          const isDisabled = !substat.description && !alias;
          return <tr key={field.name}>
            <td>
              <Button
                type='secondary'
                disabled={isDisabled}
                onClick={() => {
                  if( !isDisabled ) {
                    // If it's disabled, then don't bother
                    if( alias ) {
                      // If we have an alias to the stat (dex_mod => dex)
                      // then open the alias instead of the referenced stat
                      Modal.open(alias.fullname, StatInfo(alias, context));
                    }
                    else {
                      // Act normally, just open it up
                      Modal.open(substat.fullname, StatInfo(substat, context));
                    }
                  }
                }}
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
    </table>}
  </div>;
}

export default class StatButton extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const props = this.props;
    const data = props.character.data;
    const stat = Stats.get(props.stat, data[props.stat]);
    const total = stat.data.getTotal();
    return <Button
      size={props.size}
      type={props.type || 'info'}
      onClick={() => {
        Modal.open(stat.fullname, StatInfo(stat, data));
      }}>
        {stat.name} {props.noPlus || total < 0 ? '' : '+'}{total}
    </Button>;
  }
}
