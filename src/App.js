import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button style={{ width: "100px", height: "50px", backgroundColor: 'white'}} onClick={callApi}>Call API</button>
      </header>
    </div>
  );
}

function callApi() {
  fetch('https://quaestio-be.azurewebsites.net/api/v1/test', { method: 'GET' })
    .then(data => data.json()) // Parsing the data into a JavaScript object
    .then(json => alert(JSON.stringify(json))) // Displaying the stringified data in an alert popup
}

export default App;
