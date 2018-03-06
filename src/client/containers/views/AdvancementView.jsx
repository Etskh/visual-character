import Action from '../../lib/Action';

import { Row, Col, } from '../../components/Core';
import NavigationWindow from '../../components/NavigationWindow';

import ExperienceBar from '../ExperienceBar';
import AdvancementSkillView from '../advancement/AdvancementSkillView';
import AdvancementClassView from '../advancement/AdvancementClassView';
import AdvancementRaceView from '../advancement/AdvancementRaceView';
import AdvancementBaseStat from '../advancement/AdvancementBaseStat';


const jqWait = (tag, func, args) => {
  return new Promise( resolve => {
    const $elem = $(tag);
    let num = $elem.length;

    args.push( () => {
      num -= 1;
      if( num <= 0) {
        resolve();
      }
    });

    $elem[func].apply($elem, args);
  });
}

const jqHide = (tag) => {
  return jqWait(tag, 'hide', ['fast']);
}
const jqShow = (tag) => {
  return jqWait(tag, 'show', ['fast']);
}


export default class AdvancementView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visibleChoice: null,
      className: props.character.choices.filter( choice => (
          choice.type === 'class'
        )).reduce( (acc, cur) => {
          // [].indexOf('wizard') -> ['wizard']
          if( acc.indexOf(cur.decision) === -1) {
            acc.push(cur.decision);
          }
          return acc;
        }, []).join('/'), // Wizard/Barbarian
    };

    this.renderChoice = this.renderChoice.bind(this);
    this.onToggleChoice = this.onToggleChoice.bind(this);
  }

  onToggleChoice(choiceType) {
    if ( this.state.visibleChoice === null ) {
      return jqHide('.vc-choiceOptions')
        .then(jqShow('.vc-choiceOptions'))
        .then(() => {
          this.setState({
            visibleChoice: choiceType,
          });
        });
      /*
      // if it's null, then make us the choice, after hiding everything
      return jqHide(`.vc-choiceOptions:not(#vc-choiceType-${choiceType})`).then(() => {
        this.setState({
          visibleChoice: choiceType,
        });
      });*/
    }

    // if we're the selected choice, then make it null
    return jqShow('.vc-choiceOptions').then(() => {
      this.setState((prevState) => {
        return {
          visibleChoice: prevState.visibleChoice === null ? choiceType : null,
        };
      });
    });
  }

  renderChoice(choice) {
    const sectionTabs = {
      'base_stat': 'Abilty Scores',
      'skill': 'Skill Selection',
      'class': 'Class Selection',
      'race': 'Race Selection',
    };
    const sectionViews = {
      'base_stat': AdvancementBaseStat,
      'skill': AdvancementSkillView,
      'class': AdvancementClassView,
      'race': AdvancementRaceView,
    };

    if ( !sectionTabs[choice.type] ) {
      const msg = `No sectionTabs for ${choice.type}`;
      console.error(msg);
      return <div key={choice.type}>{msg}</div>
    }
    if ( !sectionViews[choice.type] ) {
      const msg = `No sectionView for ${choice.type}`;
      console.error(msg);
      return <div key={choice.type}>{msg}</div>
    }

    // True if this choice is currently selected
    const isSelectedChoice = this.state.visibleChoice !== null && this.state.visibleChoice &&
      this.state.visibleChoice === choice.type;

    return <div key={choice.type}
      className="vc-choiceOptions"
      id={`vc-choiceType-${choice.type}`}>
      {/* Choice button */}
      <div
        className="btn btn-primary" style={{
        width: '100%',
        marginTop: 4,
        display: this.state.visibleChoice === null || isSelectedChoice ? 'block' : 'none',
      }} onClick={() => {
        this.onToggleChoice(choice.type);
      }}>
        <span className={"fa fa-lg fa-chevron-right"} aria-hidden="true" style={{
          float: 'right',
          // only show when there is no selected choice
          visibility: isSelectedChoice ? 'hidden' : 'visible',
        }}></span>
        <span className={"fa fa-lg fa-chevron-left"} aria-hidden="true" style={{
          float: 'left',
          // Only show when we're the selected choice
          visibility: !isSelectedChoice ? 'hidden' : 'visible',
        }}></span>
        <span>{sectionTabs[choice.type]}</span>
      </div>
      {/* Choice component */}
      <div style={{
        display: !isSelectedChoice ? 'none' : 'block',
      }}>{React.createElement(sectionViews[choice.type], {
        character: this.props.character,
        choice: choice,
        onSelect: (character) => {
          // TODO: nicely animate the current window closing
          // But also, reload with the new actions
          this.onToggleChoice(null);
          Action.fire('character.change', character);
        },
      }, null)}</div>
    </div>;
  }

  render() {
    const character = this.props.character;
    // Get choices where the decision isn't made
    const outstandingChoices = character.choices.filter( choice => {
      return !choice.decision || (choice.type === 'skill' && !choice.target);
    });

    return <NavigationWindow
      title='Advancement'>
      { this.state.className === '' ? null :
        <div>
          {/* if they haven't chosen a class, don't display a name or exp bar. */}
          <Row>
            <Col><h3>{character.name} the level {character.get('level')} {this.state.className}</h3></Col>
          </Row>
          <Row>
            <Col>{ExperienceBar(character)}</Col>
          </Row>
        </div>
      }
      <Row>
        <Col>
          {
            // If there are no choices
            outstandingChoices.length === 0 ?
                <div className="alert alert-success">
                  No outstanding choices remain
                </div>
            // If there are choices
            : outstandingChoices.map(this.renderChoice)
          }
        </Col>
      </Row>
    </NavigationWindow>;
  }
}
