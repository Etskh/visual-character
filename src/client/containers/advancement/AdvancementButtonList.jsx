import PropTypes from 'prop-types';
import { Row, Col, Button } from '../../components/Core';

export default class AdvancementButtonList extends React.Component {
  constructor(props) {
    super(props);

    if ( !this.props.onSave ) {
      console.warn('No onSave property for AdvancementButtonList');
    }

    this.state = {
      selectedItem: null,
      list: [],
    };
  }

  componentDidMount() {
    this.props.loadAll().then( items => {
      this.setState({
        list: items,
      });
    });
  }

  onSelectItem(item) {
    this.setState({
      selectedItem: item,
    });
  }

  render() {
    const selectedTitle = this.state.selectedItem ? this.state.selectedItem.title : null;
    const isUnselected = selectedTitle === null;
    return <div>
      <Row spacing={1}>
        <Col>{this.props.description}</Col>
      </Row>
      <Row>
        <Col align='center'>
          {this.state.list.map( item => {
            return <Button key={item.title}
              onClick={() => {
                this.onSelectItem(item);
              }}
              type={item.title === selectedTitle ? 'success' : 'primary'}>
              {item.title}
            </Button>
          })}
        </Col>
      </Row>
      <Row>
        <Col align='right'>
          <Button
            size='large'
            disabled={isUnselected}
            type={isUnselected ? 'secdonary': 'success'}
            onClick={() => {
              this.props.onSave(this.state.selectedItem);
            }}>
            {`Select`}
          </Button>
        </Col>
      </Row>
    </div>;
  }
}


AdvancementButtonList.propTypes = {
  description: PropTypes.node.isRequired,
  loadAll: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
