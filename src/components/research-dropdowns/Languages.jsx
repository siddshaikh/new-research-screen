import { FormControl, Select, MenuItem, OutlinedInput } from "@mui/material";
import PropTypes from "prop-types";

const Languages = ({ languages, language, setLanguage, classes }) => {
  const selectedLanguages = Object.entries(languages)
    .filter(([_, languagecode]) => language.includes(languagecode))
    .map(([languagename, _]) => languagename);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };
  return (
    <div style={{ height: 25 }} className="flex items-center">
      <FormControl className="w-28">
        <Select
          multiple
          displayEmpty
          value={language}
          onChange={handleLanguageChange}
          className={classes.dropDowns}
          input={<OutlinedInput />}
          MenuProps={{ PaperProps: { style: { height: 200 } } }}
          inputProps={{ "aria-label": "Without label" }}
          sx={{ fontSize: "0.8em" }}
          renderValue={() => {
            if (selectedLanguages.length === 0) {
              return <em>Languages</em>;
            }
            return selectedLanguages.join(", ");
          }}
        >
          <MenuItem value="" disabled>
            <em>Languages</em>
          </MenuItem>
          {Object.entries(languages).map(([languagename, languagecode]) => (
            <MenuItem
              key={languagecode}
              value={languagecode}
              sx={{ fontSize: "0.8em" }}
            >
              {languagename}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

Languages.propTypes = {
  languages: PropTypes.objectOf(PropTypes.string).isRequired,
  language: PropTypes.arrayOf(PropTypes.string).isRequired,
  setLanguage: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};
export default Languages;
