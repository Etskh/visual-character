
import Icon from './core/Icon';

export default class DebugFooter extends React.Component {
  render() {
    return <div className="container">
      {`Screen size: (${window.innerWidth}x${window.innerHeight})`}
    </div>;
  }
}
