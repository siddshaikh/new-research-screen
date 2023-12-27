import { useContext, useState } from "react";
import {
  makeStyles,
  Typography,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Divider,
  Button,
} from "@material-ui/core";
import useFetchData from "../hooks/useFetchData";
import Loader from "../components/loader/Loader";
import axios from "axios";
import { ResearchContext } from "../context/ContextProvider";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },

  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  typography: {
    fontSize: "0.7em",
  },
  select: {
    height: "12px",
    fontSize: "0.7em",
    padding: 10,
    width: 120,
  },
  customMenu: {
    maxHeight: "200px",
  },
  dateField: {
    height: "12px",
  },
}));

const DDComp = () => {
  const { userToken, setQc2PrintTableData } = useContext(ResearchContext);
  const classes = useStyles();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  // loading for the tabledata search
  const [isTableDataLoading, setIsTableDataLoading] = useState(false);
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");

  const formattedFromDate = `${year}-${month}-${day} 00:00:00`;
  const formattedToDate = `${year}-${month}-${day} 23:59:59`;

  const [fromDate, setFromDate] = useState(formattedFromDate);
  const [toDate, setToDate] = useState(formattedToDate);
  // clients
  const [client, setClient] = useState("");
  const {
    data: clientData,
    loading,
    error,
  } = useFetchData(`${BASE_URL}clientlist`);
  console.log(clientData, loading, error);
  // with category without category
  const [withWithoutCate, setWithWthoutCate] = useState("");
  // categories
  const [categories, setCategories] = useState("");
  // companies
  const [companies, setCompanies] = useState([]);
  const { data: companyData } = useFetchData(
    `${BASE_URL}companylist/${client}`
  );
  // cities
  const [cities, setCities] = useState("");
  const { data: cityData } = useFetchData(`${BASE_URL}citieslist/`);
  // languages
  const [languages, setLanguages] = useState([]);
  const { data: languageData } = useFetchData(`${BASE_URL}languagelist/`);
  // publication group
  const [publicationGroup, setPublicationGroup] = useState("");
  const { data: publicationGroupData } = useFetchData(
    `${BASE_URL}publicationgroups/`
  );
  // reporting subject
  const [reportingSubject, setReportingSubject] = useState("");
  // reporting tone
  const [reportingTone, setReportingTone] = useState("");
  // publication
  const [publications, setPublications] = useState("");
  const { data: publicationsdata } = useFetchData(
    `${BASE_URL}publications/${publicationGroup}`
  );
  // pubtype
  const [pubType, setPubType] = useState("");
  // qc1Userlist
  const [qc1Users, setQC1Users] = useState([]);
  const { data: qc1UserData } = useFetchData(`${BASE_URL}qcuserlist/`);
  // qc2userlist
  const [qc2Users, setQC2Users] = useState([]);
  const { data: qc2UserData } = useFetchData(`${BASE_URL}qcuserlist/`);
  // page number
  const [pageNumber, setPageNumber] = useState("");
  // artical type
  const [articalType, setArticalType] = useState("");
  // tv
  const [tv, setTv] = useState("");
  // loading for dropdown
  const [dropdownLoading, setDropdownLoading] = useState(false);

  const handleDropdownOpen = () => {
    setDropdownLoading(true);

    setTimeout(() => {
      setDropdownLoading(false);
    }, 2000);
  };

  // searching table data basis on values selection
  const handleDataSearch = async () => {
    setIsTableDataLoading(true);
    try {
      const formattedStringCompanies = companies
        .map((item) => `'${item}'`)
        .join(",");
      console.log(formattedStringCompanies);
      const requestData = {
        client_id: client,
        company_id: formattedStringCompanies,
        date_type: "Upload",
        from_date: fromDate.toLocaleString().replace("T", " "),
        to_date: toDate.toLocaleString().replace("T", ""),
        // search_text: "MG Motor",
      };
      const headers = {
        Authorization: "Bearer " + userToken,
      };
      const response = await axios.post(
        `${BASE_URL}listArticlebyQCPrint/`,
        requestData,
        {
          headers,
        }
      );
      if (response?.data?.feed_data) {
        setQc2PrintTableData(response.data.feed_data);
        setIsTableDataLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsTableDataLoading(false);
    }
  };
  return (
    <div className="relative">
      <hr />
      {/* loader */}
      <div className="absolute">{dropdownLoading && <Loader />}</div>
      <div>
        {/* divided in two sections */}
        {/* first section */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* client */}
          <div className="flex items-center justify-start gap-4 ml-2">
            {/* title */}
            <Typography className={classes.typography}>Client</Typography>
            {/* first ddw */}
            <FormControl variant="outlined" className={classes.formControl}>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                className={`${classes.select}`}
                value={client}
                onChange={(e) => setClient(e.target.value)}
                MenuProps={{
                  anchorOrigin: {
                    vertical: "bottom", // Position of the menu relative to the dropdown
                    horizontal: "left", // Position of the menu relative to the dropdown
                  },
                  transformOrigin: {
                    vertical: "top", // Position of the selected item relative to the dropdown
                    horizontal: "left", // Position of the selected item relative to the dropdown
                  },
                  getContentAnchorEl: null,
                  PaperProps: {
                    style: {
                      maxHeight: 200,
                      width: 200,
                    },
                  },
                }}
              >
                {clientData?.data?.clients &&
                  clientData.data.clients.map((item) => (
                    <MenuItem value={item.clientid} key={item.clientid}>
                      {item.clientname}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            {/* second ddw */}
            <FormControl variant="outlined" className={classes.formControl}>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                className={`${classes.select} ${classes.customMenu}`}
                placeholder="select"
                value={withWithoutCate}
                onChange={(e) => setWithWthoutCate(e.target.value)}
              >
                <MenuItem value={"With Category"}>With Category</MenuItem>
                <MenuItem value={"No Category"}>No Category</MenuItem>
              </Select>
            </FormControl>
          </div>
          {/* category */}
          <div className="flex items-center justify-start gap-4 ml-2">
            <Typography className={classes.typography}>Category</Typography>
            <FormControl variant="outlined" className={classes.formControl}>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                className={classes.select}
                placeholder="select"
                value={categories}
                onChange={(e) => setCategories(e.target.value)}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={30}>30</MenuItem>
              </Select>
            </FormControl>
          </div>
          {/* publication group */}
          <div className="flex items-center justify-start gap-4 ml-2">
            <Typography className={classes.typography}>
              Publication group
            </Typography>
            <FormControl variant="outlined" className={classes.formControl}>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                className={classes.select}
                placeholder="select"
                value={publicationGroup}
                onChange={(e) => setPublicationGroup(e.target.value)}
                onOpen={handleDropdownOpen}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 200,
                      width: 200,
                    },
                  },
                }}
              >
                {publicationGroupData?.data?.publication_groups &&
                  publicationGroupData.data.publication_groups.map((items) => (
                    <MenuItem
                      value={items.publicationgroupid}
                      key={items.publicationgroupid}
                    >
                      {items.publicationgroupname}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
          {/* reporting subject */}
          <div className="flex items-center justify-start gap-4 ml-2">
            <Typography className={classes.typography}>
              Reporting Subject
            </Typography>
            <FormControl variant="outlined" className={classes.formControl}>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                className={classes.select}
                placeholder="select"
                value={reportingSubject}
                onChange={(e) => setReportingSubject(e.target.value)}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={30}>30</MenuItem>
              </Select>
            </FormControl>
          </div>
          {/* from date */}
          <div className="flex items-center justify-start gap-4 ml-2">
            <Typography className={classes.typography}>From Date</Typography>
            <TextField
              type="datetime-local"
              variant="outlined"
              size="small"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputProps={{ style: { fontSize: "0.8rem", height: 25, top: 6 } }}
            />
          </div>
          {/* reporting tone */}
          <div className="flex items-center justify-start gap-4 ml-2">
            <Typography className={classes.typography}>
              Reporting Tone
            </Typography>
            <FormControl variant="outlined" className={classes.formControl}>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                className={classes.select}
                placeholder="select"
                value={reportingTone}
                onChange={(e) => setReportingTone(e.target.value)}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={30}>30</MenuItem>
              </Select>
            </FormControl>
            <span className="flex items-center gap-2">
              <TextField
                type="checkbox"
                size="small"
                InputProps={{
                  style: { fontSize: "0.8rem", height: 25, top: 6 },
                }}
              />
              <Typography className={classes.typography}>No Company</Typography>
            </span>
          </div>
          {/*  Search Keyword*/}
          <div className="flex items-center justify-start gap-4 ml-2">
            <Typography className={classes.typography}>
              Search Keyword
            </Typography>
            <TextField
              placeholder="Select Keyword"
              variant="outlined"
              size="small"
              InputProps={{ style: { fontSize: "0.8rem", height: 25, top: 6 } }}
            />
            <FormControl variant="outlined" className={classes.formControl}>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                className={classes.select}
                placeholder="select"
              >
                <MenuItem value={10}>OR</MenuItem>
                <MenuItem value={20}>AND</MenuItem>
              </Select>
            </FormControl>
          </div>
          {/* search button */}
          <Button variant="text" color="default" onClick={handleDataSearch}>
            {isTableDataLoading ? "Loading" : "Search"}
          </Button>
        </div>
        <Divider style={{ margin: 2 }} />
        {/* divider */}
        {/* second section */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* company */}
          <div className="flex items-center justify-start gap-4 ml-2">
            <Typography className={classes.typography}>Company</Typography>
            <FormControl variant="outlined" className={classes.formControl}>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                className={classes.select}
                placeholder="select"
                multiple
                value={companies}
                onChange={(e) => setCompanies(e.target.value)}
                MenuProps={{
                  anchorOrigin: {
                    vertical: "bottom", // Position of the menu relative to the dropdown
                    horizontal: "left", // Position of the menu relative to the dropdown
                  },
                  transformOrigin: {
                    vertical: "top", // Position of the selected item relative to the dropdown
                    horizontal: "left", // Position of the selected item relative to the dropdown
                  },
                  getContentAnchorEl: null,
                  PaperProps: {
                    style: {
                      maxHeight: 200,
                      width: 200,
                    },
                  },
                }}
              >
                {companyData?.data?.companies?.length > 0 &&
                  companyData.data.companies.map((items) => (
                    <MenuItem value={items.companyid} key={items.companyid}>
                      {items.companyname}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
          {/* city and language */}
          <div className="flex items-center justify-start gap-4 ml-2">
            {/* city */}
            <Typography className={classes.typography}>City</Typography>
            <FormControl variant="outlined" className={classes.formControl}>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                className={classes.select}
                placeholder="select"
                value={cities}
                onChange={(e) => setCities(e.target.value)}
                MenuProps={{
                  anchorOrigin: {
                    vertical: "bottom", // Position of the menu relative to the dropdown
                    horizontal: "left", // Position of the menu relative to the dropdown
                  },
                  transformOrigin: {
                    vertical: "top", // Position of the selected item relative to the dropdown
                    horizontal: "left", // Position of the selected item relative to the dropdown
                  },
                  getContentAnchorEl: null,
                  PaperProps: {
                    style: {
                      maxHeight: 200,
                      width: 200,
                    },
                  },
                }}
              >
                {cityData?.data?.cities?.length > 0 &&
                  cityData?.cities?.map((items) => (
                    <MenuItem key={items.cityid} value={items.cityid}>
                      {items.cityname}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            {/* language */}
            <Typography className={classes.typography}>Language</Typography>
            <FormControl variant="outlined" className={classes.formControl}>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                className={classes.select}
                placeholder="select"
                multiple
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 200,
                      width: 200,
                    },
                  },
                }}
              >
                {languageData?.data?.languages &&
                  Object.entries(languageData.languages).map(
                    ([languageName, languageCode]) => (
                      <MenuItem key={languageCode} value={languageCode}>
                        {languageName}
                      </MenuItem>
                    )
                  )}
              </Select>
            </FormControl>
          </div>
          {/* Publication and pubtype */}
          <div className="flex items-center justify-start gap-4 ml-2">
            {/* publication */}
            <Typography className={classes.typography}>Publication</Typography>
            <FormControl variant="outlined" className={classes.formControl}>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                className={classes.select}
                placeholder="select"
                value={publications}
                onChange={(e) => setPublications(e.target.value)}
              >
                {publicationsdata?.data?.publications?.length > 0 &&
                  publicationsdata.publications.map((items) => (
                    <MenuItem
                      key={items.publicationid}
                      value={items.publicationid}
                    >
                      {items.publicationname}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            {/* pub type */}
            <Typography className={classes.typography}>Pub Type</Typography>
            <FormControl variant="outlined" className={classes.formControl}>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                className={classes.select}
                placeholder="select"
                value={pubType}
                onChange={(e) => setPubType(e.target.value)}
              >
                <MenuItem value={"Daily"}>DAILY</MenuItem>
                <MenuItem value={"Magazine"}>MAGAZINE</MenuItem>
                <MenuItem value={"All"}>ALL</MenuItem>
              </Select>
            </FormControl>
          </div>
          {/* System ArticalId */}
          <div className="flex items-center justify-start gap-4 ml-2">
            <Typography className={classes.typography}>
              {" "}
              System ArticalId
            </Typography>
            <TextField
              variant="outlined"
              size="small"
              InputProps={{ style: { fontSize: "0.8rem", height: 25, top: 6 } }}
            />
          </div>
          {/* to date */}
          <div className="flex items-center justify-start gap-4 ml-2 mt-2">
            <Typography className={classes.typography}>To Date</Typography>
            <TextField
              type="datetime-local"
              variant="outlined"
              size="small"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputProps={{ style: { fontSize: "0.8rem", height: 25, top: 6 } }}
            />
          </div>
          {/* qc2 and qc1 */}
          <div className="flex items-center justify-start gap-4 ml-2">
            {/* qc2 */}
            <Typography className={classes.typography}>QC 2</Typography>
            <FormControl variant="outlined" className={classes.formControl}>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                className={classes.select}
                placeholder="select"
              >
                <MenuItem value={"NO"}>NO</MenuItem>
                <MenuItem value={"Yes"}>YES</MenuItem>
                <MenuItem value={"Partial No"}>PARTIAL NO</MenuItem>
                <MenuItem value={"All"}>ALL</MenuItem>
              </Select>
            </FormControl>
            {/* qc1 */}
            <Typography className={classes.typography}>QC 1</Typography>
            <FormControl variant="outlined" className={classes.formControl}>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                className={classes.select}
                placeholder="select"
              >
                <MenuItem value={"Yes"}>YES</MenuItem>
                <MenuItem value={"No"}>NO</MenuItem>
                <MenuItem value={"All"}>ALL</MenuItem>
              </Select>
            </FormControl>
          </div>
          {/* page number, Artical Type & TV  */}
          <div className="flex items-center justify-start gap-4 ml-2">
            {/* page number */}
            <Typography className={classes.typography}>Page Number</Typography>
            <TextField
              variant="outlined"
              placeholder="0"
              size="small"
              value={pageNumber}
              onChange={(e) => setPageNumber(e.target.value)}
              InputProps={{ style: { fontSize: "0.8rem", height: 25, top: 6 } }}
            />
            {/* artical type */}
            <Typography className={classes.typography}>Artical Type</Typography>
            <FormControl variant="outlined" className={classes.formControl}>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                className={classes.select}
                placeholder="select"
                value={articalType}
                onChange={(e) => setArticalType(e.target.value)}
              >
                <MenuItem value={"Print"}>PRINT</MenuItem>
                <MenuItem value={"Internet"}>INTERNET</MenuItem>
                <MenuItem value="All">ALL</MenuItem>
              </Select>
            </FormControl>
            {/* TV */}
            <Typography className={classes.typography}>TV</Typography>
            <FormControl variant="outlined" className={classes.formControl}>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                className={classes.select}
                placeholder="select"
                value={tv}
                onChange={(e) => setTv(e.target.value)}
              >
                <MenuItem value={"All"}>ALL</MenuItem>
                <MenuItem value={"Yes"}>YES</MenuItem>
                <MenuItem value={"No"}>NO</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
      </div>
      <Divider style={{ margin: 2 }} />
      {/* third section of search bar and qc users ddw */}
      <div className="flex items-center gap-2 mt-1 ml-2">
        {/* search content/headline */}
        <div className="flex items-center">
          <Typography className={classes.typography}>
            Search Content/headline
          </Typography>
          <TextField
            id=""
            placeholder="Search"
            size="small"
            variant="outlined"
            InputProps={{ style: { fontSize: "0.8rem", height: 25, top: 6 } }}
          />
        </div>
        {/* search only headline */}
        <div className="flex items-center">
          <Typography className={classes.typography}>
            Search Only Headlines
          </Typography>
          <TextField
            id=""
            placeholder="Search"
            size="small"
            variant="outlined"
            InputProps={{ style: { fontSize: "0.8rem", height: 25, top: 6 } }}
          />
        </div>
        {/* Manual prominence */}
        <div className="flex items-center">
          <Typography className={classes.typography}>
            Manual Prominence
          </Typography>
          <TextField
            id=""
            placeholder="Search"
            size="small"
            variant="outlined"
            InputProps={{ style: { fontSize: "0.8rem", height: 25, top: 6 } }}
          />
        </div>
        {/* qc1by user */}
        <div className="flex items-center">
          <Typography className={classes.typography}>QC1 by User</Typography>
          <FormControl
            size="small"
            variant="outlined"
            className={classes.formControl}
          >
            <Select
              className={classes.select}
              multiple
              value={qc1Users}
              onChange={(e) => setQC1Users(e.target.value)}
              MenuProps={{
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
                getContentAnchorEl: null,
                PaperProps: {
                  style: {
                    maxHeight: 200,
                    width: 200,
                  },
                },
              }}
            >
              {qc1UserData?.data?.qc_users?.length > 0 &&
                qc1UserData.data?.qc_users.map((item) => (
                  <MenuItem value={item.usersid} key={item.username}>
                    {item.username}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>
        {/* qc2 by user */}
        <div className="flex items-center">
          <Typography className={classes.typography}>QC2 by User</Typography>
          <FormControl
            size="small"
            variant="outlined"
            className={classes.formControl}
          >
            <Select
              className={classes.select}
              multiple
              value={qc2Users}
              onChange={(e) => setQC2Users(e.target.value)}
              MenuProps={{
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
                getContentAnchorEl: null,
                PaperProps: {
                  style: {
                    maxHeight: 200,
                    width: 200,
                  },
                },
              }}
            >
              {qc2UserData?.data?.qc_users?.length > 0 &&
                qc2UserData.data.qc_users.map((item) => (
                  <MenuItem value={item.usersid} key={item.username}>
                    {item.username}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>
      </div>
      <hr className="mt-1" />
    </div>
  );
};

export default DDComp;
