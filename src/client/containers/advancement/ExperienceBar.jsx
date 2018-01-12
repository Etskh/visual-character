import { Button } from '../../components/Core';

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
  return <Button
    size='large'
    style={{
      width: '100%',
      margin: 0,
      position: 'relative',
    }}
    type='warning'>
      <div style={happyStyle}>{current}</div>
      <div style={depressedStyle}>/{next}</div>
    </Button>;
}
