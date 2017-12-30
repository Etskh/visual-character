import { checkDataAgainstRules } from '../lib/core';
import Modal from '../components/Modal';
import Stats from '../lib/Stats';

const getStat = (statName, context) => {
  const stat = Stats[statName];
  if( !stat ) {
    console.error(`No known stat called ${statName}`);
    return null;
  }

  stat.stat = statName;
  if( context ) {
    stat.breakdown = context.breakdown(statName);
    stat.value = stat.breakdown.total;
  }

  return stat;
};

function MoreDetails(stat, character) {
  // TICKET: make this a button to show the other stat!
  // https://github.com/Etskh/visual-character/issues/37
  return <div>{stat.fullname}</div>
}


function StatInfo(stat, character) {
  return <div>
    <p>{stat.description}</p>
    <table style={{
      width: '100%',
    }}>
      <tbody>
        {Object.keys(stat.breakdown).map( substat => {
          // Get a special renderer for total
          if( substat === 'total' ) {
            return null;
          }
          // Make this the object, but dont give context to get breakdown... yet.
          if( substat === 'base' ) {
            substat = {
              stat: 'base',
              name: 'base',
              fullname: 'Base',
              description: 'You get this for free',
            };
          }
          else {
            substat = getStat(substat);
          }
          const value = stat.breakdown[substat.stat];

          return <tr key={substat.name}>
            <td>{MoreDetails(substat, character)}</td>
            <td style={{
              textAlign: 'center',
            }}>{value}</td>
          </tr>
        })}
        <tr>
          <td style={{
            fontWeight: 'bold',
            textAlign: 'right',
          }}>total</td>
          <td style={{
            fontWeight: 'bold',
            textAlign: 'center',
          }}>{stat.value}</td>
        </tr>
      </tbody>
    </table>
  </div>;
}




export default function BreakdownButton (props) {
  checkDataAgainstRules(props, {
    'name': {
      optional: 'string',
    },
    // Optional, but we only accept large and small
    'size': {
      optional: ['small', 'large'],
    },
    'noPlus': {
      optional: 'boolean',
    },
    'character': 'object',
    // TICKET: Get all possible stats it could be
    // https://github.com/Etskh/visual-character/issues/38
    'stat': 'string',
  });

  // get the stat
  const stat = getStat(props.stat, props.character);
  const name = props.name ? props.name : stat.name;

  return <button
    style={{
      margin: 4,
    }}
    className={[
      'btn',
      'btn-info',
      props.size !== 'large' ? 'btn-sm' : '',
    ].join(' ')}
    onClick={() => {
      Modal.open(stat.fullname, 'OK', StatInfo(stat, props.character));
    }}>
    {`${name} ${((props.noPlus !== true && stat.value >= 0) ? '+' : '') + stat.value}`}
  </button>;
}
