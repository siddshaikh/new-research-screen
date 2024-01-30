import {
  Autocomplete,
  TextField,
  styled,
  createTheme,
  ThemeProvider,
  Paper,
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
    },
    "& .MuiInputLabel-root": {
      fontSize: "0.8em",
      transform: "none",
    },
  },
  smallerText: {
    fontSize: "0.9em",
    "& input::placeholder": {
      fontSize: "0.9em",
      color: "black !important",
      fontStyle: "italic",
      opacity: 1,
      letterSpacing: "1px",
    },
  },
}));
const SearchableCategory = ({
  categories,
  label,
  setCategory,
  category,
  width,
}) => {
  const classes = useStyles();
  const handleSelectChange = (event, newValue) => {
    setCategory(newValue || null);
  };

  const CustomAutocomplete = styled(Autocomplete)({
    width: width,
  });

  const selectedOption =
    (categories && categories.find((option) => option === category)) || null;
  return (
    <ThemeProvider theme={theme}>
      <CustomAutocomplete
        className={classes.autocomplete}
        options={categories || []}
        disableClearable
        ListboxProps={{ style: { maxHeight: 200 } }}
        getOptionLabel={(option) => option}
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
                padding: "0 5px 8px 0",
                margin: 0,
                color: "black !important",
                textAlign: "center",
              },
            }}
          />
        )}
        value={selectedOption}
        onChange={handleSelectChange}
        PaperComponent={(props) => (
          <Paper {...props} style={{ ...props.style, width: 200 }} />
        )}
      />
    </ThemeProvider>
  );
};
SearchableCategory.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string),
  label: PropTypes.string.isRequired,
  setCategory: PropTypes.func.isRequired,
  category: PropTypes.string,
  width: PropTypes.string,
};
export default memo(SearchableCategory);
