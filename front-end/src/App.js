import {useState, useEffect} from "react";
import axios from 'axios';

const URL ="http://localhost:5000";

function App() {
  const [numbers, setNumbers] = useState([]);
  const [listening, setListening] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (!listening) {
      const events = new EventSource(URL + "/updates");

      events.onmessage = (event) => {
        const data = JSON.parse(event.data);

        setNumbers(data);
      }
      setListening(true);
    }
  }, [listening])

  const doIt = (e) => {
    e.preventDefault();
    axios.post(URL + "/beginCalls");
    setDisabled(true)
  }

  return (
    <div>
      <button onClick={doIt} disabled={disabled}>DO IT!</button>
      <ul className="App">
        {numbers.map(n => <li>{n.number}: {n.status}</li>)}
      </ul>
    </div>
  );
}

export default App;
