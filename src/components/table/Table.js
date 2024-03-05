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

const THead = (<>
  <tr><th>Cell 1</th><th>Cell 2</th><th>Cell 3</th></tr>
</>);

const TBody = (<>
  <tr><td>Cell 1</td><td>Cell 2</td><td>Cell 3</td></tr>
  <tr><td>Cell 1</td><td>Cell 2</td><td>Cell 3</td></tr>
  <tr><td>Cell 1</td><td>Cell 2</td><td>Cell 3</td></tr>
  <tr><td>Cell 1</td><td>Cell 2</td><td>Cell 3</td></tr>
</>);

function Table({children, style}) {
  return (
    <div style={{...style, ...divClasses}}>
      <table style={positionClasses}>
        <thead>{THead}</thead>
        <tbody>{TBody}</tbody>
      </table>
    </div>
  );
}

export default Table;