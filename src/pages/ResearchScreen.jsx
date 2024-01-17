import { useContext, useEffect, useRef, useState } from "react";
import {
  Divider,
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  dateTypes,
  qc1Array,
  continents,
  countriesByContinent,
  qc2Array,
} from "../utils/dataArray";
import ResearchTable from "../components/research-components/ResearchTable";
import { ResearchContext } from "../context/ContextProvider";
import useFetchData from "../hooks/useFetchData";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../components/loader/Loader";
import SearchableDropDown from "../components/dropdowns/SearchableDropdown";
import CheckboxComp from "../components/checkbox/Checkbox";

const useStyle = makeStyles(() => ({
  dropDowns: {
    height: 25,
    fontSize: "0.8em",
    marginTop: "1em",
  },

  clientForm: {
    width: 300,
  },
  menuPaper: {
    maxHeight: 200,
    width: 200,
    background: "#d4c8c7",
  },
}));
const ReasearchScreen = () => {
  const classes = useStyle();
  const [clients, setClients] = useState([]);
  const [company, setCompany] = useState([]);
  const [companies, setCompanies] = useState([]);
  //languages
  const [language, setLanguage] = useState([]);
  // selecting continent
  const [continent, setContinent] = useState([]);
  // basis onn the selection of the continent showing th country
  const [country, setCountry] = useState([]);
  //languages from getting an api
  const [languages, setLanguages] = useState([]);
  // image
  const [isImage, setIsImage] = useState(0);
  // video
  const [isVideo, setIsVideo] = useState(0);
  // qcusers data
  // data type separate
  const [dateType, setDateType] = useState("article");
  // qc by defaut it will be null
  const [qc1done, setQc1done] = useState("");
  // qc2done
  const [qc2done, setQc2done] = useState("");
  // qc1by
  const [qc1by, setQc1by] = useState([]);
  // qc2by
  const [qc2by, setQc2by] = useState([]);
  const [qcUsersData, setQcUsersData] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  // loading state for the tableData fetching
  const [tableDataLoading, setTableDataLoading] = useState(false);
  // converting arrays to the string.
  const [langsToString, setLangsToString] = useState("");
  const [continentsToString, setContinentsToString] = useState("");
  const [countriesToString, setCountriesToString] = useState("");
  const [qc1byuserToString, setQc1byuserToString] = useState("");
  const [qc2byuserToString, setQc2byuserToString] = useState("");

  const {
    clientId,
    setClientId,
    fromDate,
    setFromDate,
    dateNow,
    setDateNow,
    // searchValue,
    // setSearchValue,
    setShowTableData,
    companyId,
    userToken,
    setTableHeaders,
    // data saved or not
    unsavedChanges,
    setUnsavedChanges,
  } = useContext(ResearchContext);
  const [tableData, setTableData] = useState([]);
  const researchTableRef = useRef(null);
  useEffect(() => {
    if (tableData.length > 1 && researchTableRef.current) {
      researchTableRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [tableData]);
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
        toast.error("You might be missing to save", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
        });
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
            // search_text: searchValue,
            // qc1_by: "qc1_user", //optional using condition
            // qc2_by: "qc2_user", //optional using condition
            //is_qc1: qc1done, //optional using condition
            //is_qc2: qc2done, //optional using condition
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
          addPropertyIfConditionIsTrue(qc1done, "is_qc1", qc1done);
          addPropertyIfConditionIsTrue(qc2done, "is_qc2", qc2done);
          addPropertyIfConditionIsTrue(
            continentsToString,
            "continent",
            continentsToString
          );
          addPropertyIfConditionIsTrue(
            countriesToString,
            "country",
            countriesToString
          );
          addPropertyIfConditionIsTrue(
            langsToString,
            "language",
            langsToString
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
      toast.warn("Please select a client.", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });
    }
  };
  const selectedUsernamesqc1 = qcUsersData
    .filter((item) => qc1by.includes(item.usersid))
    .map((selectedItem) => selectedItem.username);
  const selectedUsernamesqc2 = qcUsersData
    .filter((item) => qc2by.includes(item.usersid))
    .map((selectedItem) => selectedItem.username);

  return (
    <div className="h-full ml-4">
      {/* Category dropdowns filter out */}
      {/* client */}
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="flex items-center gap-1 flex-wrap mt-2">
            <div className="flex items-center mt-1" style={{ height: 25 }}>
              <SearchableDropDown
                options={clients}
                setTestClient={setClientId}
                testclient={clientId}
                label={"Clients"}
                width={300}
              />
            </div>
            {/* comapany */}
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
            {/* Dataetype */}
            <div style={{ height: 25 }} className="flex items-center">
              <FormControl className="w-24">
                <Select
                  value={dateType}
                  onChange={handleDateTypeChange}
                  className={classes.dropDowns}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  sx={{ fontSize: "0.8em" }}
                >
                  <MenuItem value="" disabled>
                    <em>Datetype</em>
                  </MenuItem>
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
            </div>
            {/* date filter from date */}
            <div style={{ height: 25 }} className="flex items-center">
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
            </div>
            {/* date filter to now date */}
            <div style={{ height: 25 }} className="flex items-center">
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
            </div>
            {/* qc1 by */}
            <div style={{ height: 25 }} className="flex items-center">
              <FormControl className="w-32">
                <Select
                  input={<OutlinedInput label="tag" />}
                  className={classes.dropDowns}
                  value={qc1by}
                  onChange={(e) => setQc1by(e.target.value)}
                  multiple
                  MenuProps={{ PaperProps: { style: { height: 200 } } }}
                  displayEmpty
                  sx={{ fontSize: "0.8em" }}
                  inputProps={{ "aria-label": "Without label" }}
                  renderValue={() => {
                    if (selectedUsernamesqc1.length === 0) {
                      return <em>Qc1 by</em>;
                    }
                    return selectedUsernamesqc1.join(", ");
                  }}
                >
                  <MenuItem value="" disabled>
                    <em>Qc1 by</em>
                  </MenuItem>
                  {qcUsersData &&
                    qcUsersData.map((item) => (
                      <MenuItem
                        key={item.usersid}
                        value={item.usersid}
                        sx={{ fontSize: "0.8em" }}
                      >
                        {item.username}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>
            {/* qc1 done */}
            <div style={{ height: 25 }} className="flex items-center">
              <FormControl className="w-28">
                <Select
                  id="qc1-checks"
                  value={qc1done}
                  onChange={handleQc1done}
                  input={<OutlinedInput label="tag" />}
                  className={classes.dropDowns}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  sx={{ fontSize: "0.8em" }}
                >
                  <MenuItem value="" disabled>
                    <em>qc1 done</em>
                  </MenuItem>
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
            </div>
            {/* qc2 by */}
            <div style={{ height: 25 }} className="flex items-center">
              <FormControl className="w-32">
                <Select
                  className={classes.dropDowns}
                  value={qc2by}
                  onChange={(e) => setQc2by(e.target.value)}
                  multiple
                  MenuProps={{ PaperProps: { style: { height: 200 } } }}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  sx={{ fontSize: "0.8em" }}
                  renderValue={() => {
                    if (selectedUsernamesqc2.length === 0) {
                      return <em>Qc2 by</em>;
                    }
                    return selectedUsernamesqc2.join(", ");
                  }}
                >
                  <MenuItem value="" disabled>
                    <em>Qc2 by</em>
                  </MenuItem>
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
            </div>
            {/* qc2 done */}
            <div style={{ height: 25 }} className="flex items-center">
              <FormControl className="w-28">
                <Select
                  displayEmpty
                  value={qc2done}
                  onChange={handleQc2done}
                  className={classes.dropDowns}
                  inputProps={{ "aria-label": "Without label" }}
                  sx={{ fontSize: "0.8em" }}
                >
                  <MenuItem value="" disabled>
                    <em>qc2 done</em>
                  </MenuItem>
                  {qc2Array.map((item) => (
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
            </div>
            {/* image checkbox */}
            <div className="flex items-center" style={{ height: 25 }}>
              <div className="mt-4">
                <CheckboxComp
                  value={isImage}
                  setValue={setIsImage}
                  label={"Image"}
                />
              </div>
            </div>
            {/* video checkbox */}
            <div style={{ height: 25 }} className="flex items-center">
              <div className="mt-4">
                <CheckboxComp
                  value={isVideo}
                  setValue={setIsVideo}
                  label={"Video"}
                />
              </div>
            </div>
            {/* searchBox for searching an article */}
            {/* <FormControl>
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
            </FormControl> */}
            {/* languages */}
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
                  renderValue={(selected) => {
                    if (selected.length === 0) {
                      return <em>Languages</em>;
                    }
                    return selected.join(", ");
                  }}
                >
                  <MenuItem value="" disabled>
                    <em>Languages</em>
                  </MenuItem>
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
            </div>
            {/* continents */}
            <div style={{ height: 25 }} className="flex items-center">
              <FormControl className="w-28">
                <Select
                  multiple
                  displayEmpty
                  value={continent}
                  onChange={handleContinentChange}
                  input={<OutlinedInput label="Name" />}
                  inputProps={{ "aria-label": "Without label" }}
                  sx={{ fontSize: "0.8em" }}
                  renderValue={(selected) => {
                    if (selected.length === 0) {
                      return <em>Continents</em>;
                    }
                    return selected.join(", ");
                  }}
                  className={classes.dropDowns}
                >
                  <MenuItem value="" disabled>
                    <em>Continents</em>
                  </MenuItem>
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
            </div>
            {/* countries */}
            <div style={{ height: 25 }} className="flex items-center">
              <FormControl className="w-28">
                <Select
                  multiple
                  displayEmpty
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  input={<OutlinedInput label="Name" />}
                  className={classes.dropDowns}
                  MenuProps={{ PaperProps: { style: { height: 200 } } }}
                  inputProps={{ "aria-label": "Without label" }}
                  sx={{ fontSize: "0.8em" }}
                  renderValue={(selected) => {
                    if (selected.length === 0) {
                      return <em>Countries</em>;
                    }
                    return selected.join(", ");
                  }}
                >
                  <MenuItem value="" disabled>
                    <em>Countries</em>
                  </MenuItem>
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
            </div>
            <button
              onClick={handleSearch}
              className={`bg-primary border border-gray-400 rounded px-10 mt-3 uppercase text-white ${
                tableDataLoading ? "text-yellow-300" : "text-white"
              }`}
            >
              {tableDataLoading ? "Loading..." : "Search"}
            </button>
          </div>
          {/* divider */}
          <Divider sx={{ marginTop: 1 }} />
          {/* table */}
          <div ref={researchTableRef}>
            <ResearchTable
              tableData={tableData}
              setTableData={setTableData}
              company={company}
              companies={companies}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ReasearchScreen;
