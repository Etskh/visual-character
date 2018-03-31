import PropTypes from 'prop-types';

export function DiceIcon(path, size) {
  const scale = (size || 1) * 16;
  return <img src={`/${path}`} width={scale * 0.95} height={scale * 1.0}/>
}

export function Icon(props) {
  if( props.icon === '1d20') {
    return DiceIcon('twenty_sided_dice.svg', props.size || 1);
  }

  const size =  props.size ? (
    props.size > 2 ? `fa-${props.size.toString()}x` : 'fa-lg') : '';

  const colour = props.colour || 'inherit';
  return <i className={`fa ${size} fa-${props.icon}`}
    style={{
      color: colour,
    }}
    aria-hidden="true">
  </i>
}
Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  colour: PropTypes.string,
  size: PropTypes.number,
};

export function Image(props) {
  return <div style={{
    width: '100%',
    minHeight: 100,
    backgroundImage: `url('${props.src}')`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
  }}></div>
}
Image.propTypes = {
  src: PropTypes.string.isRequired,
  minHeight: PropTypes.number,
};


export function Row(props) {
  const style = Object.assign(props.style || {}, {
    marginTop: props.spacing ? `${props.spacing}em` : 0,
    marginBottom: props.spacing ? `${props.spacing}em` : 0,
  });

  return <div style={style} className="row">
    {props.children}
  </div>;
}

export function Col(props) {
  const alignment = props.align ? props.align : 'left';
  const classNames = ['col'];
  if( typeof props.size === 'number' ) {
    // if it's a number, then we want only col-{size}
    classNames.push(`col-${props.size}`);
  }
  else if ( typeof props.size === 'object' ) {
    Object.keys(props.size).forEach( size => {
      if( size === 'mobile') {
        classNames.push(`col-${props.size[size]}`);
      }
      else if( size === 'desktop' ) {
        classNames.push(`col-sm-${props.size[size]}`);
      }
    });
  }

  classNames.push(props.className || '');

  return <div
    className={classNames.join(' ')}
    style={Object.assign(props.style || {}, {
      textAlign: alignment,
    })}>
    {props.children}
  </div>;
}

export function Button(props) {
  const type = props.type || 'secondary';
  return <button
    style={Object.assign({
      margin: 4,
    }, props.style || {})}
    className={[
      'btn',
      props.size !== 'large' ? 'btn-sm' : '',
      'btn-' + type,
      props.disabled ? 'disabled' : '',
    ].join(' ')}
    onClick={(e) => {
      if( !props.disabled ) {
        props.onClick(e);
      }
    }}>
    {props.children}
  </button>;
}

// TODO: add proptypes to button

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({
      hasError: true,
    });
    // You can also log the error to an error reporting service
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

export function RadioChoices(name, selected, onChange, choices) {
  return <div className="input-group input-group-sm">
    <div className="input-group-prepend">
      <div className="input-group-text">{name}</div>
    </div>
    <select
      defaultValue={selected}
      className="form-control form-control-sm"
      onChange={(e) => {
        const value = e.target.options[e.target.selectedIndex].value;
        if( onChange ) {
          onChange(value);
        }
      }}>
      {choices.map(choice => {
        return <option
          key={choice}
          value={choice}>{choice}</option>;
      })}
    </select>
  </div>;
  /*
  Old way:

  return <div className="btn-group btn-group-toggle" data-toggle="buttons">
    {choices.map(choice => {
      const isActive = choice === selected;
      return <label key={choice} className={`btn btn-secondary btn-sm ${isActive?'active':''}`}>
        <input type="radio" name={name} id={choice} autoComplete="off"   onClick={(e) => {
            console.log(e);
          }}/> {choice}
      </label>
    })}
  </div>;*/
}
