const pkg = require('../../../package');

export default class DebugFooter extends React.Component {
  render() {
    return <div className="container">
      {`Screen size: (${window.innerWidth}x${window.innerHeight})`}<br/>
      {`Version: ${pkg.version}`}
    </div>;
  }
}
