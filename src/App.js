import Body from './components/Body';
import Button from './components/button/Button';
import Table from './components/table/Table';

const top_section = {
  'gridColumnStart': 1,
  'gridColumnEnd': 4,
  'gridRowStart': 1,
  'gridRowEnd': 4
}

const table_section = {
  'gridColumnStart': 4,
  'gridColumnEnd': 7,
  'gridRowStart': 1,
  'gridRowEnd': 4
}

function App() {
  return (
    <Body>
      <Button style={top_section}>Click Me 2</Button>
      <Table style={table_section}>
        <tr><td>Cell 1</td><td>Cell 2</td><td>Cell 3</td></tr>
        <tr><td>Cell 1</td><td>Cell 2</td><td>Cell 3</td></tr>
        <tr><td>Cell 1</td><td>Cell 2</td><td>Cell 3</td></tr>
        <tr><td>Cell 1</td><td>Cell 2</td><td>Cell 3</td></tr>
        <tr><td>Cell 1</td><td>Cell 2</td><td>Cell 3</td></tr>
      </Table>
    </Body>
  );
}

export default App;
