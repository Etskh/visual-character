import Race from '../../lib/Race';
import AdvancementListView from './AdvancementListView';

export default class AdvancementRaceView extends React.Component {
  constructor(props) {
    super(props);
    this.onSave = this.onSave.bind(this);
  }

  onSave(selectedItem) {
    return this.props.character.selectRace(selectedItem);
  }

  render() {
    const renderRace = (race) => {
      return <div>
        <h3>{race.name}</h3>
        <p>{race.description}</p>
        <p>{race.stat_description}</p>
      </div>;
    }

    return <AdvancementListView
      description='The choice of race determines what your character is inheritly good at'
      onSelect={this.props.onSelect}
      loadAll={() => Race.all()}
      onSave={this.onSave}
      renderItem={renderRace}
    />;
  }
}
