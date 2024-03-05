const positionClasses = {
  'width': '100%',
  'height': '100%',
  'border': 'solid 2px var(--base-2)',
  'color': 'var(--base-3)',
  'background-color': 'var(--base-1)',
  'font-size': 'var(--universal-fontsize)'
};

const divClasses = {
  'height': 'calc(100% - var(--global-margins)*2)',
  'width': 'calc(100% - var(--global-margins)*2)',
  'padding': 'var(--global-margins)',
};

function Button({children, style}) {
  return (
    <div style={{...style, ...divClasses}}>
      <button style={positionClasses}>
        {children}
      </button>
    </div>
  );
}

export default Button;