import { useContext, useEffect, useState } from "react";
import {
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
  FormGroup,
  makeStyles,
} from "@material-ui/core";
import {
  dateTypes,
  qc1Array,
  continents,
  countriesByContinent,
} from "../utils/dataArray";
import ResearchTable from "../components/research-components/ResearchTable";
import { ResearchContext } from "../context/ContextProvider";
import useFetchData from "../hooks/useFetchData";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../components/loader/Loader";

const useStyle = makeStyles(() => ({
  dropDowns: {
    height: 20,
    fontSize: "0.8em",
    marginTop: "1em",
  },
  inputLabel: {
    fontSize: "0.8em",
    top: -5,
    left: 10,
  },

  clientForm: {
    width: 300,
  },
  menuPaper: {
    maxHeight: 200,
    width: 200,
    marginTop: 5,
    background: "#d4c8c7",
  },
}));
const Home = () => {
  const classes = useStyle();
  const [clients, setClients] = useState([]);

  const [clientName, setClientName] = useState([]);
  //languages from getting an api
  const [languages, setLanguages] = useState([]);
  // qcusers data
  const [qcUsersData, setQcUsersData] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  // loading state for the tableData fetching
  const [tableDataLoading, setTableDataLoading] = useState(false);
  // converting arrays to the string.
  const [langsTostring, setLangsToString] = useState("");
  const [continentsTostring, setContinentsToString] = useState("");
  const [countriesToString, setCountriesToString] = useState("");
  const [qc1byuserToString, setQc1byuserToString] = useState("");
  const [qc2byuserToString, setQc2byuserToString] = useState("");

  const {
    clientId,
    setClientId,
    company,
    setCompany,
    companies,
    setCompanies,
    fromDate,
    setFromDate,
    dateNow,
    setDateNow,
    qc1done,
    setQc1done,
    qc2done,
    setQc2done,
    qc1by,
    setQc1by,
    qc2by,
    setQc2by,
    isImage,
    setIsImage,
    isVideo,
    setIsVideo,
    searchValue,
    setSearchValue,
    setShowTableData,
    dateType,
    setDateType,
    language,
    setLanguage,
    continent,
    setContinent,
    country,
    setCountry,
    companyId,
    userToken,
    setTableData,
    setTableHeaders,
    // data saved or not
    unsavedChanges,
    setUnsavedChanges,
  } = useContext(ResearchContext);
  // base url
  const base_url = import.meta.env.VITE_BASE_URL;
  // clients
  const {
    data: clientData,
    error: ClientEror,
    loading: clientLoading,
  } = useFetchData(`${base_url}clientlist/`, clients);
  useEffect(() => {
    if (clientData.data) {
      setClients(clientData.data.clients);
    } else {
      console.log(ClientEror);
    }
  }, [clientData, setClients, ClientEror, setLanguage, setTableData]);
  // fetching the companies
  const {
    data: companyData,
    error: companyError,
    loading: companyLoading,
  } = useFetchData(clientId ? `${base_url}companylist/${clientId}` : "");
  useEffect(() => {
    if (clientId || companyData.data) {
      setCompany(companyData?.data?.companies || []);
      setCompanies([]);
      setUnsavedChanges(false);
      setShowTableData(false);
    } else {
      console.log(companyError);
    }
  }, [
    clientId,
    companyData,
    setCompany,
    setCompanies,
    setShowTableData,
    companyError,
    setUnsavedChanges,
  ]);
  //fetching qcusers
  const { data: qcUserData, error: qcUserDataError } = useFetchData(
    `${base_url}qcuserlist/`
  );
  useEffect(() => {
    if (qcUserData.data) {
      setQcUsersData(qcUserData.data.qc_users);
    } else {
      console.log(qcUserDataError);
    }
  }, [qcUserData, qcUserDataError]);
  //  fetching langueges
  const {
    data: langs,
    error: langsError,
    loading: langsLoading,
  } = useFetchData(`${base_url}languagelist/`);

  useEffect(() => {
    if (langs.data) {
      setLanguages(langs.data.languages);
    } else {
      console.log(langsError);
    }
  }, [langs, langsError]);

  // loading states
  const isLoading = clientLoading || companyLoading || langsLoading;
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    // Find the selected client based on the clientname
    const selectedClient = clients.find(
      (client) => client.clientname === value
    );

    // Set the clientId in the state
    if (selectedClient) {
      setClientId(selectedClient.clientid);
    }

    // Set the selected client name
    setClientName(value);
  };
  const handleSelectedCompanies = (event) => {
    const {
      target: { value },
    } = event;
    setCompanies(value ? value : "");
  };
  const handleDateTypeChange = (event) => {
    setDateType(event.target.value);
  };
  const handleFromDate = (e) => {
    const { value } = e.target;

    if (value) {
      const date = new Date(value); // Creating a Date object from the value
      if (!isNaN(date.getTime())) {
        const formattedValue = date
          .toISOString()
          .slice(0, 16)
          .replace("T", " ");
        setFromDate(formattedValue);
      }
    }
  };
  const handleToDate = (e) => {
    const { value } = e.target;
    if (value) {
      const date = new Date(value); // Creating a Date object from the value
      if (!isNaN(date.getTime())) {
        const formattedValue = date
          .toISOString()
          .slice(0, 16)
          .replace("T", " ");
        setDateNow(formattedValue);
      }
    }
  };
  const handleQc1done = (event) => {
    setQc1done(event.target.value);
  };
  const handleQc2done = (event) => {
    setQc2done(event.target.value);
  };
  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };
  const handleContinentChange = (event) => {
    const {
      target: { value },
    } = event;
    const selectedContinent =
      typeof value === "string" ? value.split(", ") : value;

    // Filter countries by the selected continent
    const selectedCountries = countriesByContinent
      .filter((item) => selectedContinent.includes(item.continent))
      .map((item) => item.countries)
      .flat();

    setContinent(selectedContinent);
    setFilteredCountries(selectedCountries);
  };

  const arrayToString = (arr) => {
    if (Array.isArray(arr)) {
      if (arr.length > 0) {
        return arr.map((item) => `'${item}'`).join(",");
      } else {
        return "";
      }
    } else {
      return "";
    }
  };
  useEffect(() => {
    const langsV = arrayToString(language);
    const continentV = arrayToString(continent);
    const countriesV = arrayToString(country);
    const qc1_userV = arrayToString(qc1by);
    const qc2_userV = arrayToString(qc2by);
    setLangsToString(langsV);
    setContinentsToString(continentV);
    setCountriesToString(countriesV);
    setQc1byuserToString(qc1_userV);
    setQc2byuserToString(qc2_userV);
  }, [language, continent, country, qc1by, qc2by]);
  // searching the tabledata using multiple parameters
  const handleSearch = async () => {
    setTableData([]);
    if (clientId) {
      if (unsavedChanges) {
        toast.error("You might be missing to save");
      } else {
        setShowTableData(companies ? true : false);
        setTableDataLoading(true);

        try {
          let requestData = {
            client_id: clientId,
            // company_id: "'690','GOOGLE_AND','1222'", //optional using condition
            date_type: dateType,
            from_date: fromDate,
            to_date: dateNow,
            search_text: searchValue,
            // qc1_by: "qc1_user", //optional using condition
            // qc2_by: "qc2_user", //optional using condition
            is_qc1: qc1done,
            is_qc2: qc2done,
            has_image: isImage,
            has_video: isVideo,
            // continent: "Asia", //optional using condition
            // country: "India",  //optional using condition
            // language: langsTostring, //optional using condition
          };

          // eslint-disable-next-line no-inner-declarations
          function addPropertyIfConditionIsTrue(condition, property, value) {
            if (condition) {
              requestData[property] = value;
            }
          }
          addPropertyIfConditionIsTrue(companyId, "company_id", companyId);
          addPropertyIfConditionIsTrue(
            qc1byuserToString,
            "qc1_by",
            qc1byuserToString
          );
          addPropertyIfConditionIsTrue(
            qc2byuserToString,
            "qc2_by",
            qc2byuserToString
          );
          addPropertyIfConditionIsTrue(
            continentsTostring,
            "continent",
            continentsTostring
          );
          addPropertyIfConditionIsTrue(
            countriesToString,
            "country",
            countriesToString
          );
          addPropertyIfConditionIsTrue(
            langsTostring,
            "language",
            langsTostring
          );

          const requestDataJSON = JSON.stringify(requestData);
          const url = `${import.meta.env.VITE_BASE_URL}listArticlebyQC/`;
          const response = await axios.post(url, requestDataJSON, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + userToken,
            },
          });
          if (response) {
            const updatedData = response.data.feed_data.map((item) => {
              return {
                ...item,
                link: (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Link
                  </a>
                ),
              };
            });
            setTableData(updatedData);
            const localeV = response.data.feed_data;
            setTableHeaders(
              Object.keys(localeV[0]).map((header) =>
                header.toUpperCase().replace(/_/g, " ")
              )
            );
          }
          setTableDataLoading(false);
        } catch (error) {
          console.log(error);
          setTableDataLoading(false);
          setTableData([]);
        }
      }
    } else {
      toast.warn("Please select a client.");
    }
  };

  return (
    <div>
      {/* Category dropdowns filter out */}
      {/* client */}
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="flex items-center gap-2 flex-wrap mt-4">
            {/* clients */}
            <FormControl className={classes.clientForm}>
              <InputLabel
                id="demo-multiple-name-label"
                className={classes.inputLabel}
              >
                Client
              </InputLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                placeholder="select"
                value={clientName}
                onChange={handleChange}
                input={<OutlinedInput label="Name" />}
                className={classes.dropDowns}
                MenuProps={{
                  classes: { paper: classes.menuPaper },
                }}
              >
                {clients &&
                  clients.map((client) => (
                    <MenuItem key={client.clientid} value={client.clientname}>
                      {client.clientname}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            {/* comapany */}
            <FormControl className="w-52">
              <InputLabel
                id="demo-multiple-checkbox-label"
                className={classes.inputLabel}
              >
                Company
              </InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={companies && companies}
                onChange={handleSelectedCompanies}
                input={<OutlinedInput label="Name" />}
                renderValue={(selected) => selected.join(", ")}
                className={classes.dropDowns}
              >
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
            {/* Dataetype */}
            <FormControl className="w-24">
              <InputLabel
                id="demo-mutiple-chip-label"
                className={classes.inputLabel}
              >
                Datetype
              </InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                value={dateType}
                onChange={handleDateTypeChange}
                input={<OutlinedInput label="Tag" />}
                className={classes.dropDowns}
              >
                {dateTypes.map((dateType) => (
                  <MenuItem
                    key={dateType.id}
                    value={dateType.value}
                    sx={{ fontSize: "0.8em" }}
                  >
                    {dateType.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* date filter from date */}
            <FormControl>
              <TextField
                size="small"
                type="datetime-local"
                value={fromDate}
                onChange={handleFromDate}
                variant="outlined"
                InputProps={{
                  style: { fontSize: "0.8rem", height: 25, top: 6 },
                }}
              />
            </FormControl>
            {/* date filter to now date */}
            <FormControl>
              <TextField
                type="datetime-local"
                value={dateNow}
                onChange={handleToDate}
                size="small"
                variant="outlined"
                InputProps={{
                  style: { fontSize: "0.8rem", height: 25, top: 6 },
                }}
              />
            </FormControl>
            {/* qc1 */}
            <FormControl className="w-32">
              <InputLabel id="qc1-select-label" className={classes.inputLabel}>
                QC1 by
              </InputLabel>
              <Select
                id="qc1-checks"
                input={<OutlinedInput label="tag" />}
                className={classes.dropDowns}
                value={qc1by}
                onChange={(e) => setQc1by(e.target.value)}
                multiple
              >
                {qcUsersData &&
                  qcUsersData?.map((items) => (
                    <MenuItem
                      key={items.usersid}
                      value={items.usersid}
                      sx={{ fontSize: "0.8em" }}
                    >
                      {items.username}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            {/* qc2 */}
            <FormControl className="w-32">
              <InputLabel id="qc1-select-label" className={classes.inputLabel}>
                QC2 by
              </InputLabel>
              <Select
                id="qc1-checks"
                input={<OutlinedInput label="tag" />}
                className={classes.dropDowns}
                value={qc2by}
                onChange={(e) => setQc2by(e.target.value)}
                multiple
              >
                {qcUsersData &&
                  qcUsersData?.map((items) => (
                    <MenuItem
                      key={items.usersid}
                      value={items.usersid}
                      sx={{ fontSize: "0.8em" }}
                    >
                      {items.username}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            {/* qc1 done */}
            <FormControl className="w-28">
              <InputLabel
                id="users-select-label"
                className={classes.inputLabel}
              >
                Isqc1 Done
              </InputLabel>
              <Select
                id="qc1-checks"
                value={qc1done}
                onChange={handleQc1done}
                input={<OutlinedInput label="tag" />}
                className={classes.dropDowns}
              >
                {qc1Array.map((item) => (
                  <MenuItem
                    key={item.id}
                    value={item.value}
                    sx={{ fontSize: "0.8em" }}
                  >
                    {item.option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* qc2 done */}
            <FormControl className="w-28">
              <InputLabel
                id="users-select-label"
                className={classes.inputLabel}
              >
                Isqc2 Done
              </InputLabel>
              <Select
                id="qc1-checks"
                value={qc2done}
                onChange={handleQc2done}
                input={<OutlinedInput label="tag" />}
                className={classes.dropDowns}
              >
                {qc1Array.map((item) => (
                  <MenuItem
                    key={item.id}
                    value={item.value}
                    sx={{ fontSize: "0.8em" }}
                  >
                    {item.option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* image checkbox */}
            <FormControl>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="default"
                      checked={isImage === 1}
                      onChange={() => {
                        setIsImage(isImage === 1 ? 0 : 1);
                      }}
                    />
                  }
                  label={<Typography variant="body2">Image</Typography>}
                />
              </FormGroup>
            </FormControl>
            {/* video checkbox */}
            <FormControl>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="default"
                      checked={isVideo === 1} // Check if isVideo equals 1
                      onChange={() => {
                        setIsVideo(isVideo === 1 ? 0 : 1); // Toggle isVideo between 0 and 1
                      }}
                    />
                  }
                  label={<Typography variant="body2">Video</Typography>}
                />
              </FormGroup>
            </FormControl>
            {/* searchBox for searching an article */}
            <FormControl>
              <TextField
                placeholder="Search"
                variant="outlined"
                size="small"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                InputProps={{
                  style: { fontSize: "0.8rem", height: 25, top: 6 },
                }}
              />
            </FormControl>
            {/* languages */}
            <FormControl className="w-28">
              <InputLabel
                id="languages-select-label"
                className={classes.inputLabel}
              >
                Languages
              </InputLabel>
              <Select
                id="languages"
                value={language}
                onChange={handleLanguageChange}
                input={<OutlinedInput label="Name" />}
                multiple
                className={classes.dropDowns}
              >
                {Object.entries(languages).map(
                  ([languagename, languagecode]) => (
                    <MenuItem
                      key={languagecode}
                      value={languagecode}
                      sx={{ fontSize: "0.8em" }}
                    >
                      {languagename}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
            {/* continents */}
            <FormControl className="w-28">
              <InputLabel
                id="continent-type-select-label"
                className={classes.inputLabel}
              >
                Continent
              </InputLabel>
              <Select
                id="continents"
                value={continent}
                onChange={handleContinentChange}
                input={<OutlinedInput label="Name" />}
                renderValue={(selected) => selected.join(", ")}
                className={classes.dropDowns}
                multiple
              >
                {continents.map((continent) => (
                  <MenuItem
                    key={continent}
                    value={continent}
                    sx={{ fontSize: "0.8em" }}
                  >
                    {continent}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* countries */}
            <FormControl className="w-28">
              <InputLabel
                id="countries-select-label"
                className={classes.inputLabel}
              >
                Countries
              </InputLabel>
              <Select
                id="countries"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                input={<OutlinedInput label="Name" />}
                multiple
                className={classes.dropDowns}
              >
                {filteredCountries.map((country) => (
                  <MenuItem
                    key={country}
                    value={country}
                    sx={{ fontSize: "0.8em" }}
                  >
                    {country}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <button
              onClick={handleSearch}
              className={`bg-primary border border-gray-400 rounded px-10 py-1 uppercase text-white ${
                tableDataLoading ? "text-yellow-300" : "text-white"
              }`}
            >
              {tableDataLoading ? "Loading..." : "Search"}
            </button>
          </div>
          {/* divider */}
          <Divider variant="middle" sx={{ m: 2 }} />
          {/* table */}
          <ResearchTable />
        </>
      )}
    </div>
  );
};

export default Home;
