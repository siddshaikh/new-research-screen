import { useState } from "react";
import {
  Autocomplete,
  Checkbox,
  TextField,
  styled,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import PropTypes from "prop-types";

const theme = createTheme({
  typography: {
    body1: {
      fontSize: "0.8em",
    },
  },
});

const useStyles = makeStyles(() => ({
  autocomplete: {
    '& .MuiAutocomplete-inputRoot[class*="MuiInput-root"]': {
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

const SearchableSelectWithSelectAll = ({
  options,
  label,
  setTestClient,
  testclient,
  width,
}) => {
  const classes = useStyles();
  const [selected, setSelected] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const handleSelectChange = (event, newValue) => {
    setTestClient(newValue?.clientid || null);
  };

  const handleSelectAll = () => {
    const allClientIds = options.map((option) => option.clientid);
    setSelected(selected.length === options.length ? [] : allClientIds);
    setTestClient(selected.length === options.length ? null : allClientIds);
  };

  const CustomAutocomplete = styled(Autocomplete)({
    width: width,
  });

  const filteredOptions = options.filter((option) =>
    option.clientname.toLowerCase().includes(searchValue.toLowerCase())
  );

  const selectedOption =
    (options && options.find((option) => option.clientid === testclient)) ||
    null;

  return (
    <ThemeProvider theme={theme}>
      <CustomAutocomplete
        className={classes.autocomplete}
        options={filteredOptions || []}
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
            onChange={(e) => setSearchValue(e.target.value)}
          />
        )}
        value={selectedOption}
        onChange={handleSelectChange}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              style={{ marginRight: 8 }}
              checked={selected}
              onChange={() => {
                const selectedIndex = selected.indexOf(option.clientid);
                const newSelected = [...selected];

                if (selectedIndex === -1) {
                  newSelected.push(option.clientid);
                } else {
                  newSelected.splice(selectedIndex, 1);
                }

                setSelected(newSelected);
                setTestClient(newSelected);
              }}
            />
            {option.clientname}
          </li>
        )}
      />
      <Checkbox
        checked={selected.length === filteredOptions.length}
        indeterminate={
          selected.length > 0 && selected.length < filteredOptions.length
        }
        onChange={handleSelectAll}
      />
      <span>Select All</span>
    </ThemeProvider>
  );
};

SearchableSelectWithSelectAll.propTypes = {
  options: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
  setTestClient: PropTypes.func.isRequired,
  testclient: PropTypes.number,
  width: PropTypes.string,
};

export default SearchableSelectWithSelectAll;
