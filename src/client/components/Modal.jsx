
const modalId = 'base-modal';
let modalInstance = null;

export default class Modal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      content: null,
      acceptText: '',
    };

    this.onSetContent = this.onSetContent.bind(this);
    this.onAccept = this.onAccept.bind(this);

    modalInstance = this;
  }

  onSetContent(title, acceptText, content, callback) {
    this.setState({
      title,
      content,
      acceptText,
      callback,
    });
  }

  onAccept(state) {
    this.state.callback(state);
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
            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" className="btn btn-primary" onClick={() => {
              $('#base-modal').modal('hide');
              const modal = document.getElementById(modalId);
              const state = {
                inputs: modal.getElementsByTagName('input'),
              };
              setTimeout(() => {
                this.onAccept(state);
              }, 300);
            }}>{this.state.acceptText}</button>
          </div>
        </div>
      </div>
    </div>;
  }
}

Modal.open = (title, acceptText, component) => {
  // TODO: allow without acceptText
  const promise = new Promise(resolve => {
    modalInstance.onSetContent(title, acceptText, component, resolve);
    $('#' + modalId).modal();
  });

  return promise;
}
