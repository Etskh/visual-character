import { Button } from '../../components/Core';

// TODO: move the styles to the stylesheet
export default function ExperienceBar(current, next) {
  const remainingPercentage = parseInt((1 - (current/next)) * 100);
  const happyStyle = {
    top: 0,
    left: 0,
    bottom: 0,
    width: `${parseInt((current/next) * 100)}%`,
    position: 'absolute',
  };
  const depressedStyle = {
    top: 0,
    right: 0,
    bottom: 0,
    textAlign: 'right',
    color: '#AAA',//AAAAAAAAA
    width: `${parseInt((1 - (current/next)) * 100)}%`,
    position: 'absolute',
    backgroundColor: 'rgba(25, 25, 25, 0.8)',
  };
  return <div className="btn-group" role="group" aria-label="Experience controls" style={{
    width: '100%',
  }}><Button
    size='large'
    type='warning'
    style={{
      width: '90%',
      fontSize: '150%',
      margin: 0,
      position: 'relative',
    }}
    onClick={() => {
      // TODO: open window to view additions, when!
    }}>
      <div style={happyStyle}>{current}</div>
      <div style={depressedStyle}>/{next}</div>
    </Button><Button size='large'
      type='success'
      style={{
        width: '10%',
        margin: 0,
      }}
      onClick={() => {
        // empty
      }}>+</Button>
  </div>;
}
