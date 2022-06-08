import {
  Autocomplete,
  TextField,
  Button,
  Container,
  Alert,
  Snackbar,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import ErrorIcon from "@mui/icons-material/Error";

function App() {
  const today = new Date();
  const dateString = today.toISOString().slice(0, 10);
  const [url, setUrl] = useState(null);
  const [name, setName] = useState(null);
  const [input, setInput] = useState(null);
  const [options, setOptions] = useState(null);
  const [guesses, setGuesses] = useState([]);

  useEffect(() => {
    const storedState = JSON.parse(localStorage.getItem(dateString));
    if (
      storedState &&
      storedState.url &&
      storedState.name &&
      storedState.guesses
    ) {
      setUrl(() => storedState.url);
      setName(() => storedState.name);
      setGuesses(() => storedState.guesses);
    } else {
      fetch(`https://voicele-api.herokuapp.com/answers/${dateString}`)
        .then((response) => response.json())
        .then((data) => {
          setUrl(data.url);
          setName(data.name);
        });
    }

    fetch("https://voicele-api.herokuapp.com/options")
      .then((response) => response.json())
      .then((data) => {
        setOptions(data);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem(
      dateString,
      JSON.stringify({ url: url, name: name, guesses: guesses })
    );
  }, [url, name, guesses]);

  const submitInput = (event) => {
    event.preventDefault();
    setGuesses((guesses) => [...guesses, input]);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Typography variant="h4" align="center" sx={{ mb: 2 }}>
        Voicele
      </Typography>

      {url && name ? (
        <div>
          <Snackbar
            open={guesses.length >= 6}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert severity="info" sx={{ width: "100%" }}>
              {name}
            </Alert>
          </Snackbar>
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
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </div>
      )}
    </Container>
  );
}

export default App;
