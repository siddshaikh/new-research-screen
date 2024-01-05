import PropTypes from "prop-types";
import { TextField } from "@mui/material";

const TextFields = ({ placeholder, value, onChange }) => {
  return (
    <TextField
      placeholder={placeholder}
      variant="outlined"
      size="small"
      InputProps={{ style: { fontSize: "0.8rem", height: 25, top: 6 } }}
      value={value}
      onChange={onChange}
    />
  );
};

TextFields.propTypes = {
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default TextFields;
