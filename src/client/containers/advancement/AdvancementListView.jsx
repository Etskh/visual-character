
import { Row, Col, Button } from '../../components/Core';

export default class AdvancementRaceView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedItem: null,
      list: [],
    };

    this.renderItemInfo = this.renderItemInfo.bind(this);
  }

  componentDidMount() {
    this.props.loadAll().then( items => {
      this.setState({
        list: items,
      });
    });
  }

  renderItemInfo(item) {
    return <div>
      <Row spacing={1}>
        <Col>
          {this.props.renderItem(item)}
        </Col>
      </Row>
      <Row>
        <Col align='center'>
          {/* TODO: generalize this button, and prompt the user that this
            choice is irreversible before the onClick fires */}
          <Button type='success'
            onClick={() => {
              this.props.onSave(this.state.selectedItem).then( character => {
                this.props.onSelect(character);
              });
            }}>
            {`Select ${item.name}`}
          </Button>
        </Col>
      </Row>
    </div>
  }

  render() {
    return <div>
      <Row spacing={1}>
        <Col><p>{this.props.description}</p></Col>
      </Row>
      <Row>
        <Col style={{
          overflow: 'scroll-y',
        }} size={4}>
          {this.state.list.map(item => {
            const isSelected = this.state.selectedItem && item.name === this.state.selectedItem.name;
            return <div key={item.name}
              className={`btn btn-sm btn-${isSelected?'info':'secondary'}`}
              onClick={() => {
                this.setState({
                  selectedItem: item,
                });
              }}
              style={{
                width: '100%',
              }}>
              {item.name}
            </div>
          })}
        </Col>
        <Col size={8}>
          {this.state.selectedItem ?
            this.renderItemInfo(this.state.selectedItem) :
            <p>Select from the left to view details.</p>
          }
        </Col>
      </Row>
    </div>;
  }
}
