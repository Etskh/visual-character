
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
