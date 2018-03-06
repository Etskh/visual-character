import Class from '../../lib/Class';

import AdvancementSection from '../Section';

export default class AdvancementClassView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      classes: [],
    };

    this.onSave = this.onSave.bind(this);
  }

  componentDidMount() {
    Class.all().then( classes => {
      this.setState({
        classes,
      });
    });
  }
  onSave() {
    // empty
  }

  render() {
    return <div>
      <p>Determines your class</p>
      <ul>
        {this.state.classes.map( cls => {
          return <li key={cls.name}>{cls.name}</li>;
        })}
      </ul>
    </div>
  }
  /*
  render() {
    return <AdvancementSection
      title={`Class`}
      onSave={this.onSave}>
      <p>Determines your ...</p>
      <ul>
        {this.state.classes.map( cls => {
          return <li key={cls.name}>{cls.name}</li>;
        })}
      </ul>
    </AdvancementSection>;
  }
  */
}
