import { Button, } from './Core';


const modalId = 'base-modal';
let modalInstance = null;
const SMALL_DELAY = 150;

export default class Modal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      content: null,
      acceptButtons: [],
      //acceptText: '',
      isHidden: true,
    };

    this.onSetContent = this.onSetContent.bind(this);
    this.onAccept = this.onAccept.bind(this);
    this.onBack = this.onBack.bind(this);
    this.isHidden = this.isHidden.bind(this);
    this.canGoBack = this.canGoBack.bind(this);

    modalInstance = this;
  }

  isHidden() {
    return this.state.isHidden;
  }
  canGoBack() {
    return false;
    //return this.state.history.length > 1;
  }

  componentDidMount() {
    const self = this;
    $(`#${modalId}`).on('hide.bs.modal', (e) => {
      self.setState({
        // When we close it, delete the history (no more going back)
        isHidden: true,
      });
    });
    $(`#${modalId}`).on('show.bs.modal', (e) => {
      self.setState({
        isHidden: false,
      });
    });
  }

  open(config) {
    // This is called by Model.open, but we'll check if there's
    // some content in here anywhere

    // Push the config as the last history
    // TODO: make sure config is a possible state
    this.onSetContent(config);

    if( this.isHidden()) {
      $(`#${modalId}`).modal();
    }

    // Focus the first <input> element in the modal
    $(`#${modalId} input`).focus();
  }

  onSetContent(config) {
    this.setState( prevState => {
      return {
        ...config,
      };
    });
  }

  onAccept(button) {
    $(`#${modalId}`).modal('hide');
    const modal = document.getElementById(modalId);
    const state = {
      inputs: modal.getElementsByTagName('input'),
    };

    setTimeout(() => {
      button.callback(state);
    }, SMALL_DELAY * 3);
  }

  onBack() {
    if( !this.canGoBack() ) {
      // If there is no history, then just close the modal!
      $(`#${modalId}`).modal('hide');
    }

    /*this.setState( prevState => {
      const config = Object.assign({}, this.state.history[this.state.history.length - 2]);
      console.log(config);
      return {
        ...config,
        //history: this.state.history.slice(0, -1),
      };
    });*/
  }

  render() {
    return <div className="modal fade" id={modalId} tabIndex="-1" role="dialog" aria-labelledby={modalId} aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">{this.state.title}</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {this.state.content}
          </div>
          <div className="modal-footer">
            <Button type='secondary'
              onClick={() => {
                this.onBack();
              }}>
              {this.canGoBack() ? 'Back' : 'Close'}
            </Button>
            {this.state.acceptButtons.map( button => {
              return <Button key={button.title}
                type='primary'
                size='large'
                onClick={() => {
                  this.onAccept(button);
                }}>{button.title}</Button>
            })}
          </div>
        </div>
      </div>
    </div>;
  }
}

Modal.open = (title, content, acceptText) => {
  const promise = new Promise(resolve => {
    const config = {
      title,
      content,
      acceptButtons: [],
    };

    if( acceptText ) {
      config.acceptButtons = [{
        title: acceptText,
        callback: resolve,
      }];
    }

    modalInstance.open(config);
  });

  return promise;
}
