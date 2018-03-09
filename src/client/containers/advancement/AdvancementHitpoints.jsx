import PropTypes from 'prop-types';
import { Row, Col, Button } from '../../components/Core';
import AdvancementButtonList from './AdvancementButtonList';

export default class AdvancementHitpoints extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      choice: props.choice,
    };

    this.onSave = this.onSave.bind(this);
  }

  onSave(roll) {
    this.props.character.selectHitpoints(roll.title).then(character => {
      this.props.onSelect(character);
    });
  }

  render() {
    const sides = parseInt(this.state.choice.target, 10);
    const buttons = [];
    for(let i = 1; i <= sides; ++i) {
      buttons.push({
        title: i,
      });
    }

    return <AdvancementButtonList
      onSave={this.onSave}
      loadAll={() => Promise.resolve(buttons)}
      description={<p>
        Every level after the first, you should roll for your hitpoints.
        They are determined by the class that you chose! Roll a {sides} sided die:
      </p>}/>;
  }
}

AdvancementHitpoints.propTypes = {
  choice: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
};
