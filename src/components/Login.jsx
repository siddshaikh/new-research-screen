import { useContext, useState } from "react";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { ResearchContext } from "../context/ContextProvider";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ff0000",
    },
  },
});

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  },
  form: {
    width: "300px",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", // Box shadow
    border: "1px solid #ccc", // Border
  },
  button: {
    backgroundColor: "#150734",
    color: "white",
  },
}));

const Login = () => {
  const classes = useStyles();
  const [password, setPassword] = useState("");
  const { name, setName, setUserToken } = useContext(ResearchContext);
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // eslint-disable-next-line no-undef
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}authenticate/`,
        {
          loginname: name,
          password: password,
        }
      );
      const data = JSON.parse(res.config.data);
      const loginname = data.loginname;
      if (res.status === 200) {
        localStorage.setItem("user", res.data.access_token);
        setUserToken(localStorage.getItem("user"));
        navigate("/");
        toast.success(`Welcome ${loginname}`);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className={classes.container}>
        <form onSubmit={handleSubmit} className={classes.form}>
          <TextField
            id="name"
            label="Name"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            id="password"
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: "1rem" }}
            className={classes.button}
          >
            Login
          </Button>
        </form>
      </Box>
    </ThemeProvider>
  );
};

export default Login;
