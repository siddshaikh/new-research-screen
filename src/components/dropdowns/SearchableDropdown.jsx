import {
  Autocomplete,
  TextField,
  styled,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import PropTypes from "prop-types";
import { memo } from "react";

const theme = createTheme({
  typography: {
    body1: {
      fontSize: "0.8em",
    },
  },
});
const useStyles = makeStyles(() => ({
  autocomplete: {
    "& .MuiAutocomplete-inputRoot[class*='MuiInput-root']": {
      display: "flex",
      alignItems: "center",
      color: "red",
    },
    "& .MuiInputLabel-root": {
      fontSize: "0.8em",
      transform: "none",
    },
  },
  smallerText: {
    fontSize: "0.8em",
    "& input::placeholder": {
      fontSize: "1em",
      color: "black",
      fontStyle: "italic",
      opacity: 1,
    },
  },
}));

const SearchableDropdown = ({
  options,
  label,
  setTestClient,
  testclient,
  width,
}) => {
  const classes = useStyles();

  const handleSelectChange = (event, newValue) => {
    setTestClient(newValue?.clientid || null);
  };

  const CustomAutocomplete = styled(Autocomplete)({
    width: width,
  });

  const selectedOption =
    (options && options.find((option) => option.clientid === testclient)) ||
    null;

  return (
    <ThemeProvider theme={theme}>
      <CustomAutocomplete
        className={classes.autocomplete}
        options={options || []}
        getOptionLabel={(option) => option.clientname}
        renderValue={(selected) => selected.join(", ")}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder={label}
            size="small"
            margin="normal"
            className={classes.smallerText}
            InputProps={{
              ...params.InputProps,
              style: {
                height: 25,
                fontSize: "0.9em",
                padding: "0 5px 0 0",
                margin: 0,
                color: "black",
                textAlign: "center",
              },
            }}
          />
        )}
        value={selectedOption}
        onChange={handleSelectChange}
      />
    </ThemeProvider>
  );
};

export default memo(SearchableDropdown);

SearchableDropdown.propTypes = {
  options: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
  setTestClient: PropTypes.func.isRequired,
  testclient: PropTypes.number,
  width: PropTypes.string,
};
