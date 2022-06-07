import {
  Autocomplete,
  TextField,
  Button,
  Container,
  Alert,
} from "@mui/material";
import { useEffect, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import ErrorIcon from "@mui/icons-material/Error";

function App() {
  const today = new Date();
  const [url, setUrl] = useState(null);
  const [name, setName] = useState(null);
  const [input, setInput] = useState(null);
  const [options, setOptions] = useState(null);
  const [guesses, setGuesses] = useState([]);

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
    setGuesses((guesses) => [...guesses, input]);
  };

  if (url && name) {
    return (
      <Container component="main" maxWidth="xs">
        <audio controls style={{ width: "100%" }}>
          <source src={url} />
        </audio>

        {[...Array(6)].map((x, i) => {
          let severity = "info";
          let icon = <QuestionMarkIcon />;
          if (guesses.length > i) {
            if (guesses[i].toLowerCase() === name.toLowerCase()) {
              severity = "success";
              icon = <CheckIcon />;
            } else {
              severity = "error";
              icon = <ErrorIcon />;
            }
          }
          return (
            <Alert key={i} icon={icon} severity={severity} sx={{ mt: 2 }}>
              {guesses.length > i ? guesses[i] : ""}
            </Alert>
          );
        })}

        <form onSubmit={submitInput}>
          <Autocomplete
            options={options}
            onChange={(_, value) => setInput(value)}
            renderInput={(params) => (
              <TextField {...params} label="Celebrity" />
            )}
            sx={{ flexGrow: 1, mt: 3 }}
          />

          <Button type="submit" sx={{ mt: 2 }} fullWidth variant="contained">
            Guess
          </Button>
        </form>
      </Container>
    );
  } else {
    return <div>Loading...</div>;
  }
}

export default App;
