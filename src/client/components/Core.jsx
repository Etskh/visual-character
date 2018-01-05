
export function Row(props) {
  return <div style={props.style || {}} className="row">
    {props.children}
  </div>;
}

export function Col(props) {
  const alignment = props.align ? props.align : 'left';
  return <div
    className={`col ${props.size?'col-xs-'+props.size:''}`}
    style={{
      textAlign: alignment,
    }}>
    {props.children}
  </div>;
}

export function Button(props) {
  const type = props.type || 'secondary';
  return <button
    style={{
      margin: 4,
    }}
    className={[
      'btn',
      'btn-' + type,
      props.size !== 'large' ? 'btn-sm' : '',
      props.disabled ? 'disabled' : '',
    ].join(' ')}
    onClick={props.onClick}>
    {props.children}
  </button>;
}
