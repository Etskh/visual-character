import Class from '../../lib/Class';
import AdvancementListView from './AdvancementListView';

export default class AdvancementClassView extends React.Component {
  constructor(props) {
    super(props);
    this.onSave = this.onSave.bind(this);
  }

  onSave(selectedItem) {
    return this.props.character.selectClass(selectedItem);
  }

  render() {
    // TODO: move these to translator
    const playstyleTitle = {
      BOLD: 'Bold playstyle',
      ADAPTABLE: 'Adaptable playstyle',
      THOUGHTFUL: 'Thoughful playstyle',
    };
    const playstyleText = {
      BOLD: 'This class excells at charging head-on into the situation. Your strong natural instincts can handle it.',
      ADAPTABLE: 'This class can take different solutions to the same problem depending on situation and opportunity.',
      THOUGHTFUL: 'This class needs some planning and preparation but when executed will have big rewards.',
    };
    const casterTitle = {
      NO: 'Martial Combatant',
      WEAK: 'Diverse Caster',
      STRONG: 'Strong Spellcaster',
    };
    const casterText = {
      NO: 'This class has extraordinary mundane abilities',
      WEAK: 'This class can cast spells at later levels, but is a competant combatant',
      STRONG: 'This class depends on their spell-casting abilities',
    };
    const meleeTitle = {
      YES: 'Melee',
      MAYBE: 'Melee or Ranged',
      NO: 'Ranged',
    };
    const meleeText = {
      YES: 'This class is very competent in melee combat',
      MAYBE: 'This class can either be melee or ranged combatant, depending on build',
      NO: 'This class usually keeps their distance from melee combat',
    };

    const renderClass = (cls) => {
      return <div>
        <h3>{cls.name}</h3>
        <p>{cls.info.description}</p>
        <h5>{playstyleTitle[cls.info.playstyle]}</h5>
        <p>{playstyleText[cls.info.playstyle]}</p>
        <h5>{casterTitle[cls.info.caster]}</h5>
        <p>{casterText[cls.info.caster]}</p>
        <h5>{meleeTitle[cls.info.melee]}</h5>
        <p>{meleeText[cls.info.melee]}</p>
      </div>;
    }

    return <AdvancementListView
      description='The choice of class determines what your role your character will serve and the options available to you'
      onSelect={this.props.onSelect}
      loadAll={() => Class.all()}
      onSave={this.onSave}
      renderItem={renderClass}
    />;
  }
}
