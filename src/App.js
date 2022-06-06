import { Autocomplete, TextField, Button } from "@mui/material";
import { useEffect, useState, Fragment } from "react";

function App() {
  const today = new Date();
  const [url, setUrl] = useState(null);
  const [name, setName] = useState(null);
  const [input, setInput] = useState(null);
  const [options, setOptions] = useState(null);

  useEffect(() => {
    fetch(
      `https://voicele-api.herokuapp.com/answers/${today
        .toISOString()
        .slice(0, 10)}`
    )
      .then((response) => response.json())
      .then((data) => {
        setUrl(data.url);
        setName(data.name);
      });

    fetch("https://voicele-api.herokuapp.com/options")
      .then((response) => response.json())
      .then((data) => {
        setOptions(data);
      });
  }, []);

  const submitInput = (event) => {
    event.preventDefault();
    if (input.toLowerCase() === name.toLowerCase()) {
      window.alert("correct!");
    } else {
      window.alert("wrong!");
    }
  };

  if (url && name) {
    return (
      <div>
        <audio controls>
          <source src={url} />
        </audio>
        <form onSubmit={submitInput}>
          <Autocomplete
            options={options}
            onChange={(_, value) => setInput(value)}
            renderInput={(params) => (
              <TextField {...params} label="Guess the Celebrity" />
            )}
          />
          <Button type="submit" fullWidth={true}>
            Submit
          </Button>
        </form>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
}

export default App;
