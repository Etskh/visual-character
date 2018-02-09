import { Row, Col, } from './Core';
import Action from '../lib/Action';

export default function BarButton(props) {
  return <button
    className='btn btn-sm vc-bar-button'
    onClick={() => {
      if( props.onClick ) {
        props.onClick();
      }
    }}>
    <div
      className={`vc-bar-good ${props.colour || 'red'}`}
      style={{
        width: parseInt(100 * (props.current / props.total)) + '%',
      }}>&nbsp;</div>
    <div className='vc-bar-text'>{props.current} / {props.total}</div>
  </button>;
}
