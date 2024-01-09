import { useContext, useEffect, useState } from "react";
import {
  FormControl,
  MenuItem,
  Select,
  Typography,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import { ResearchContext } from "../../context/ContextProvider";
import useFetchData from "../../hooks/useFetchData";
import { toast } from "react-toastify";
import { DDSearchValues } from "../../utils/dataArray";
import Button from "../custom/Button";
import TableDropdown from "../dropdowns/TableDropdown";
import Loader from "../loader/Loader";
import TextFields from "../TextFields/TextField";
import MainTable from "../table/MainTable";

const useStyles = makeStyles(() => ({
  dropDowns: {
    height: 25,
    fontSize: "0.8em",
    marginTop: "1em",
  },
  textField: {
    "& .MuiInputBase-input": {
      fontSize: "0.8em",
    },
  },
  resize: {
    fontSize: "0.8em",
    height: 25,
  },
  headerCheckBox: {
    color: "white",
  },
}));
const ResearchTable = () => {
  const classes = useStyles();
  // context values
  const {
    name,
    userToken,
    companies,
    company,
    companyId,
    setCompanyId,
    tableData,
    setTableData,
    setUnsavedChanges,
  } = useContext(ResearchContext);

  // state variables for posting data to database
  const [currentDateWithTime, setCurrentDateWithTime] = useState("");
  const [postingLoading, setPostingLoading] = useState(false);
  //  varibale for the fetching the data convert array to string

  // dropdown items (for editing/updating row values)
  const [editRow, setEditRow] = useState("");
  // selectedRowData
  const [selectedRowData, setSelectedRowData] = useState([]);
  // search values from the table
  const [selectedRadioValue, setSelectedRadioValue] = useState(null);
  const [headerForSearch, setHeaderForSearch] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [secondHeaderForSearch, setSecondHeaderForSearch] = useState("");
  const [secondSearchValue, setSecondSearchValue] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  // data for the edit
  const [editValue, setEditValue] = useState("");
  // Function to fetch table data
  // updatedrows
  const [updatedRows, setUpdatedRows] = useState([]);
  // saved success
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  // showing tooltip when hover the table cell
  // sotrting
  const [sortLoading, setSortLoading] = useState(false);
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortColumn, setSortColumn] = useState("");
  // dropdown fetch
  const url = import.meta.env.VITE_BASE_URL;
  // reporting tone
  const [reportingTones, setReportingTones] = useState([]);
  const [reportingTone, setReportingTone] = useState("");
  const { data: reportingTons } = useFetchData(`${url}reportingtonelist`);
  useEffect(() => {
    if (reportingTons.data) {
      setReportingTones(reportingTons.data.reportingtones_list);
    }
  }, [reportingTons]);
  // prominence
  const [prominences, setProminences] = useState([]);
  const [prominence, setProminence] = useState("");
  const { data: prominenceLists } = useFetchData(`${url}prominencelist`);
  useEffect(() => {
    if (prominenceLists.data) {
      setProminences(prominenceLists.data.prominence_list);
    }
  }, [prominenceLists]);
  //reportingsubject_list
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState("");
  const { data: subjectLists } = useFetchData(`${url}reportingsubjectlist`);
  useEffect(() => {
    if (subjectLists.data) {
      setSubjects(subjectLists.data.reportingsubject_list);
    }
  }, [subjectLists]);
  //subcategory_list
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const { data: categoryLists } = useFetchData(`${url}subcategorylist`);
  useEffect(() => {
    if (categoryLists.data) {
      setCategories(categoryLists.data.subcategory_list);
    }
  }, [categoryLists]);

  // Function to find company id based on selection
  const getCompanyId = (companyData, companyNames) => {
    if (!companyNames) {
      return null;
    }

    let companyId = [];

    for (const companyName of companyNames) {
      const company = companyData.find(
        (item) => item.companyname === companyName
      );
      companyId.push(company ? company.companyid : null);
    }

    return companyId;
  };

  useEffect(() => {
    const companyIds = getCompanyId(company, companies);
    companyIds
      ? setCompanyId(companyIds?.map((item) => `'${item}'`).join(","))
      : setCompanyId([]);
  }, [companies, company, companyId, setCompanyId]);
  // effect for the setting data for the editing row data basis on dropdown selection
  useEffect(() => {
    const editRowValues = selectedRowData
      ?.map((item) => item[editRow])
      .filter((value) => value !== undefined);
    setEditValue(editRowValues[0]);
  }, [selectedRowData, editRow]);

  const applySort = async () => {
    setSortLoading(true);
    let sortedData = [];

    if (searchedData.length > 0) {
      sortedData = [...searchedData];
    } else {
      sortedData = [...tableData];
    }

    await new Promise((resolve) => {
      setTimeout(() => {
        sortedData.sort((a, b) => {
          const valueA = (a[sortColumn] || "").toString().toLowerCase();
          const valueB = (b[sortColumn] || "").toString().toLowerCase();

          if (!isNaN(valueA) && !isNaN(valueB)) {
            return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
          } else {
            const comparison = valueA.localeCompare(valueB);
            return sortDirection === "asc" ? comparison : -comparison;
          }
        });

        if (searchedData.length > 0) {
          setSearchedData(sortedData);
        } else {
          setTableData(sortedData);
        }

        resolve();
      }, 1000);
    });

    setSortLoading(false);
  };

  useEffect(() => {
    applySort();
  }, [sortColumn, sortDirection]);

  // search function using table header
  const hanleTableSearchUsingHeader = (event) => {
    setHeaderForSearch(event.target.value);
    setSearchValue("");
    setSelectedRadioValue(null);
    setSecondHeaderForSearch("");
    setSecondSearchValue("");
  };
  const handleSecondSearchUsingHeader = (event) => {
    if (!selectedRadioValue) {
      toast.warning("Please select AND or OR condition first!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
      return;
    }
    setSecondHeaderForSearch(event.target.value);
    setSecondSearchValue("");
  };
  // radio change
  const handleChange = (event) => {
    setSelectedRadioValue(event.target.value);
  };
  // handle Search Table Values
  const handleSearch = () => {
    setTableLoading(true);
    let output = [];

    if (headerForSearch === "all") {
      output = tableData.filter((rowData) => {
        const allRowValues = Object.values(rowData).join(" ").toLowerCase();
        return allRowValues.includes(searchValue.toLowerCase());
      });
    } else {
      output =
        searchValue.trim() !== "" && headerForSearch
          ? tableData.filter(
              (rowData) =>
                rowData[headerForSearch] &&
                rowData[headerForSearch]
                  .toString()
                  .toLowerCase()
                  .includes(searchValue.toLowerCase())
            )
          : [];
    }

    if (secondHeaderForSearch === headerForSearch) {
      // If the second header is the same as the first, search in the entire dataset
      output = tableData.filter((rowData) => {
        const allRowValues = Object.values(rowData).join(" ").toLowerCase();
        return allRowValues.includes(secondSearchValue.toLowerCase());
      });
    } else if (
      secondHeaderForSearch &&
      secondHeaderForSearch !== headerForSearch &&
      secondHeaderForSearch !== "all"
    ) {
      let secondOutput =
        secondSearchValue.trim() !== "" && secondHeaderForSearch
          ? tableData.filter(
              (rowData) =>
                rowData[secondHeaderForSearch] &&
                rowData[secondHeaderForSearch]
                  .toString()
                  .toLowerCase()
                  .includes(secondSearchValue.toLowerCase())
            )
          : [];

      if (selectedRadioValue === "and" && secondOutput.length > 0) {
        output = output.filter((row) => secondOutput.includes(row));
      } else if (selectedRadioValue === "or" && secondOutput.length > 0) {
        output = [...output, ...secondOutput];
      }
    }

    if (!output.length && secondHeaderForSearch !== "all") {
      // Handling cases where no results are found
      if (!output.length && secondSearchValue.trim()) {
        toast.warning("No results", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
      } else if (!output.length && !secondSearchValue.trim()) {
        toast.warning("No results", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
      } else {
        setSearchedData(tableData);
      }
      return;
    }

    setSearchedData(output);
    setTableLoading(false);
  };
  //updating tabledata
  const handleApplyChanges = () => {
    if (selectedRowData.length > 0) {
      const updatedSelectedRows = selectedRowData.map((row) => ({
        ...row,
        reporting_tone: reportingTone || row.reporting_tone,
        reporting_subject: subject || row.reporting_subject,
        subcategory: category || row.subcategory,
        prominence: prominence || row.prominence,
        detail_summary: editValue || row.detail_summary,
      }));

      const updatedTableData = tableData.map((row) => {
        const updatedRow = updatedSelectedRows.find(
          (selectedRow) => selectedRow.social_feed_id === row.social_feed_id
        );
        return updatedRow || row;
      });

      // Update only the items that exist in selectedRowData in both searchedData and tableData
      const updatedSearchedData = searchedData.map((row) => {
        const updatedRow = updatedSelectedRows.find(
          (selectedRow) => selectedRow.social_feed_id === row.social_feed_id
        );
        return updatedRow || row;
      });

      setUpdatedRows(updatedSelectedRows);
      setTableData(updatedTableData);
      setSearchedData(updatedSearchedData);
      setUnsavedChanges(true);
    } else {
      toast.warning("Please select at least one item to update", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });
    }
  };

  // getting current date with time for the posting data to database
  useEffect(() => {
    const dateNow = new Date();
    const formattedDate = dateNow.toISOString().slice(0, 19).replace("T", " ");
    setCurrentDateWithTime(formattedDate);
  }, []);

  //posting updated tabledata to database
  const handlePostData = async () => {
    setSavedSuccess(true);
    setPostingLoading(true);
    // if company has not selected(get company ids)
    const comapnyNames = updatedRows.map((item) => item.company_name);
    let foundCompanyIds = comapnyNames.map((name) => {
      let foundObject = company.find((obj) => obj.companyname === name);
      return foundObject ? foundObject.companyid : null;
    });

    const dataToSending = updatedRows.map((row, index) => ({
      COMPANYID: foundCompanyIds[index] || "", // Fetching the ID corresponding to the row
      DETAILSUMMARY: row.detail_summary,
      KEYWORD: "",
      MODIFIEDBY: name,
      MODIFIEDON: currentDateWithTime,
      PROMINENCE: row.prominence,
      REPORTINGSUBJECT: row.reporting_subject,
      REPORTINGTONE: row.reporting_tone,
      SOCIALFEEDID: row.social_feed_id,
      SUBCATEGORY: row.subcategory,
    }));

    try {
      const url = `http://51.68.220.77:8000/update2database/`;
      if (dataToSending.length > 0) {
        await axios.post(url, dataToSending, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + userToken,
          },
        });
        setUpdatedRows([]);
        setPostingLoading(false);
        setSuccessMessage("Data updated successfully!");
        setSelectedRowData([]);
        // Clearing the dropdown values
        setReportingTone("");
        setSubject("");
        setCategory("");
        setProminence("");
        setUnsavedChanges(false);
      } else {
        setSuccessMessage("No data to save.");
        setPostingLoading(false);
      }
    } catch (error) {
      if (error.message === "Network Error") {
        setSuccessMessage("Please check your internet connection.");
        setPostingLoading(false);
      }
    }
  };

  // showing success or failure message for the limited time
  useEffect(() => {
    if (savedSuccess) {
      const timeoutId = setTimeout(() => {
        setSavedSuccess(false);
        setSuccessMessage("");
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [savedSuccess]);

  return (
    <div className="relative">
      {sortLoading ||
        (tableLoading && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200 bg-opacity-50 z-50">
            <Loader />
          </div>
        ))}
      {/* filters for editing the cells */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* first find */}
        <FormControl className="w-28">
          <Select
            className={classes.dropDowns}
            value={headerForSearch}
            onChange={hanleTableSearchUsingHeader}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            MenuProps={{ PaperProps: { style: { height: 200 } } }}
          >
            <MenuItem value="" sx={{ color: "lightgray" }}>
              <em>select</em>
            </MenuItem>

            {DDSearchValues.map((item) => (
              <MenuItem
                value={item.value}
                key={item.title}
                sx={{ fontSize: "0.8em" }}
              >
                {item.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* searchfield for the searching tableData */}
        <TextFields
          placeholder={"Find Text"}
          value={searchValue}
          setValue={setSearchValue}
        />
        {/* radio button */}
        <FormControl component="fieldset" sx={{ height: 25 }}>
          <RadioGroup
            aria-label="and-or-label"
            name="and-or-label"
            value={selectedRadioValue}
            onChange={handleChange}
            row
          >
            <FormControlLabel
              value="and"
              control={<Radio size="small" />}
              label="AND"
              sx={{
                fontSize: "0.8em",
                "& .MuiTypography-root": { fontSize: "0.8em" },
              }}
            />
            <FormControlLabel
              value="or"
              control={<Radio size="small" />}
              label="OR"
              sx={{
                fontSize: "0.8em",
                "& .MuiTypography-root": { fontSize: "0.8em" },
              }}
            />
          </RadioGroup>
        </FormControl>
        {/* second find */}
        <FormControl className="w-28">
          <Select
            className={classes.dropDowns}
            value={secondHeaderForSearch}
            onChange={handleSecondSearchUsingHeader}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            MenuProps={{ PaperProps: { style: { height: 200 } } }}
          >
            <MenuItem value="" sx={{ color: "lightgray" }}>
              <em>select</em>
            </MenuItem>

            {DDSearchValues.map((item) => (
              <MenuItem
                value={item.value}
                key={item.title}
                sx={{ fontSize: "0.8em" }}
              >
                {item.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextFields
          placeholder={"Find Text"}
          value={secondSearchValue}
          setValue={setSecondSearchValue}
        />
        <Button btnText={"Find"} onClick={handleSearch} />
      </div>
      <hr className="mt-1" />
      <div className="flex items-center flex-wrap gap-4">
        {" "}
        {/* dropdowns for separating the files */}
        {/* reporting tone */}
        <TableDropdown
          value={reportingTone}
          setValues={setReportingTone}
          placeholder={"Tone"}
          mappingValue={reportingTones}
        />
        {/* Prominence */}
        <TableDropdown
          value={prominence}
          setValues={setProminence}
          placeholder={"Prominence"}
          mappingValue={prominences}
        />
        {/* Reporting subject */}
        <TableDropdown
          value={subject}
          setValues={setSubject}
          placeholder={"Subject"}
          mappingValue={subjects}
        />
        {/*category */}
        <TableDropdown
          value={category}
          setValues={setCategory}
          placeholder={"Category"}
          mappingValue={categories}
        />
        {/* Details summary */}
        <FormControl className="w-28">
          <Select
            value={editRow}
            onChange={(e) => setEditRow(e.target.value)}
            variant="outlined"
            className={classes.dropDowns}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            MenuProps={{ PaperProps: { style: { height: 200 } } }}
          >
            <MenuItem value="" sx={{ color: "lightgrey" }}>
              <em>Select</em>
            </MenuItem>
            <MenuItem value="detail_summary" sx={{ fontSize: "0.8em" }}>
              Summary
            </MenuItem>
          </Select>
        </FormControl>
        <TextFields
          placeholder={"Select a Summary"}
          value={editValue}
          setValue={setEditValue}
        />
        <Button btnText={"Apply"} onClick={handleApplyChanges} />
        <button
          className={` bg-primary border border-gray-400 rounded px-10 mt-3 uppercase text-white tracking-wider ${
            postingLoading ? "text-yellow-300" : "text-white"
          }`}
          onClick={handlePostData}
        >
          {postingLoading ? "Loading..." : "Save"}
        </button>
        {/* saved or not */}
        <div>
          {savedSuccess && (
            <Typography className="text-primary">{successMessage}</Typography>
          )}
        </div>
      </div>
      <MainTable
        searchedData={searchedData}
        selectedRowData={selectedRowData}
        setSelectedRowData={setSelectedRowData}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        setSortColumn={setSortColumn}
      />
    </div>
  );
};

export default ResearchTable;
