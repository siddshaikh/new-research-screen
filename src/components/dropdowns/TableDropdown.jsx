import { FormControl, MenuItem, Select } from "@mui/material";
import { makeStyles } from "@mui/styles";
import PropTypes from "prop-types";

const useStyles = makeStyles(() => ({
  dropDowns: {
    height: 25,
    fontSize: "0.8em",
    marginTop: "1em",
  },
}));

export default function TableDropdown({
  value,
  setValues,
  placeholder,
  mappingValue,
}) {
  const classes = useStyles();

  return (
    <FormControl className="w-28">
      <Select
        value={value}
        onChange={(e) => setValues(e.target.value)}
        className={classes.dropDowns}
        displayEmpty
        inputProps={{ "aria-label": "Without label" }}
        MenuProps={{ PaperProps: { style: { height: 200, width: 200 } } }}
        sx={{ fontSize: "0.8em" }}
      >
        <MenuItem value="" disabled>
          <em>{placeholder}</em>
        </MenuItem>
        {mappingValue.map((item) => (
          <MenuItem
            key={item.value || item}
            value={item.value || item}
            sx={{ fontSize: "0.8em" }}
          >
            {item.tonality || item.prominence}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

TableDropdown.propTypes = {
  value: PropTypes.any.isRequired,
  setValues: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  mappingValue: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        value: PropTypes.string.isRequired,
        tonality: PropTypes.string.isRequired,
        isMultiple: PropTypes.bool.isRequired,
      }),
    ])
  ).isRequired,
};
