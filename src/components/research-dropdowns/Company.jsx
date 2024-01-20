import { FormControl, Select, OutlinedInput, MenuItem } from "@mui/material";
import PropTypes from "prop-types";

const Company = ({ companies, setCompanies, classes, company }) => {
  const handleSelectedCompanies = (event) => {
    const {
      target: { value },
    } = event;
    setCompanies(value ? value : "");
  };
  return (
    <div style={{ height: 25 }} className="flex items-center">
      <FormControl className="w-52">
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={companies}
          onChange={handleSelectedCompanies}
          input={<OutlinedInput label="Name" />}
          className={classes.dropDowns}
          sx={{ fontSize: "0.8em" }}
          MenuProps={{
            PaperProps: { style: { height: 200 } },
          }}
          displayEmpty
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <em>Companies</em>;
            }
            return selected.join(", ");
          }}
        >
          <MenuItem value="" disabled>
            <em>Select Companies</em>
          </MenuItem>
          {company &&
            company?.map((companyItem) => (
              <MenuItem
                key={companyItem.companyid}
                value={companyItem.companyname}
                sx={{ fontSize: "0.8em" }}
              >
                {companyItem.companyname}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </div>
  );
};
Company.propTypes = {
  companies: PropTypes.array.isRequired,
  setCompanies: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  company: PropTypes.array,
};
export default Company;
