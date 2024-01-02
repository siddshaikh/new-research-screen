import React, { useContext, useEffect, useState } from "react";
import {
  Checkbox,
  FormControl,
  MenuItem,
  Select,
  TableCell,
  TableRow,
  TextField,
  Typography,
  Tooltip,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import { ResearchContext } from "../../context/ContextProvider";
import useFetchData from "../../hooks/useFetchData";
import { toast } from "react-toastify";
import { DDSearchValues } from "../../utils/dataArray";
import Button from "../custom/Button";
import TableDropdown from "../dropdowns/TableDropdown";
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";
import getHeaderAbbreviation from "../../utils/concatHeader";

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
    showTableData,
    companyId,
    setCompanyId,
    tableData,
    setTableData,
    tableHeaders,
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
  const [headerForSearch, setHeaderForSearch] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  // data for the edit
  const [editValue, setEditValue] = useState("");
  // Function to fetch table data
  // updatedrows
  const [updatedRows, setUpadatedRows] = useState([]);
  // saved success
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  // showing tooltip when hover the table cell
  // sotrting
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
  }, [companies, company, companyId]);
  // effect for the setting data for the editing row data basis on dropdown selection
  useEffect(() => {
    const editRowValues = selectedRowData
      ?.map((item) => item[editRow])
      .filter((value) => value !== undefined);
    setEditValue(editRowValues ? editRowValues.join(" ") : "");
  }, [selectedRowData, editRow]);

  // Function to handle the selection of a row
  const handleRowSelect = (rowData) => {
    setSelectedRowData((prevSelectedRows) => {
      const isSelected = prevSelectedRows.some((row) => row === rowData);

      if (isSelected) {
        return prevSelectedRows.filter((row) => row !== rowData);
      } else {
        if (searchedData.length > 0) {
          // Check if the selected row is within the searched data
          if (searchedData.includes(rowData)) {
            return [...prevSelectedRows, rowData];
          }
        } else {
          return [...prevSelectedRows, rowData];
        }
      }
      return prevSelectedRows;
    });
  };
  const handleMasterCheckboxChange = () => {
    const allSelected = selectedRowData.length === tableData.length;

    if (searchedData.length > 0) {
      setSelectedRowData(allSelected ? [] : [...searchedData]);
    } else {
      setSelectedRowData(allSelected ? [] : [...tableData]);
    }
  };

  const handleSort = (clickedHeader) => {
    if (sortColumn === clickedHeader) {
      // Toggle sort direction if the same column is clicked
      setSortDirection((prevSortDirection) =>
        prevSortDirection === "asc" ? "desc" : "asc"
      );
    } else {
      // Set the new column to sort and reset the direction to ascending
      setSortColumn(clickedHeader);
      setSortDirection("asc");
    }
  };
  const applySort = () => {
    let sortedData = [];

    if (searchedData.length > 0) {
      sortedData = [...searchedData]; // If searched data is present, sort that
    } else {
      sortedData = [...tableData]; // If not, use the original table data
    }

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
      setSearchedData(sortedData); // Update the sorted searchedData
    } else {
      setTableData(sortedData); // Update the sorted tableData
    }
  };

  useEffect(() => {
    applySort();
  }, [sortColumn, sortDirection]);

  // handle Search Table Values
  const handleSearch = () => {
    const output =
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

    setSearchedData(output);
  };
  // search function using table header
  const hanleTableSearchUsingHeader = (event) => {
    setHeaderForSearch(event.target.value);
    setSearchedData([]);
    setSearchValue("");
  };
  //updating tabledata
  const handleApplyChanges = () => {
    if (selectedRowData.length > 0) {
      setUnsavedChanges(true);
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

      setUpadatedRows(updatedSelectedRows);
      setTableData(updatedTableData);
    } else {
      toast.warning("Please select at least one item to update");
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
        setUpadatedRows([]);
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
  const highlightSearch = (text) => {
    if (!text || !searchValue.trim()) {
      return text;
    }

    if (typeof text === "string") {
      if (text.startsWith("<a") && text.endsWith("</a>")) {
        return text;
      }

      const regex = new RegExp(`(${searchValue})`, "gi");
      const parts = text.split(regex);

      return parts.map((part, index) =>
        regex.test(part) ? (
          <span key={index} className="text-white bg-black">
            {part}
          </span>
        ) : (
          part
        )
      );
    }

    return text;
  };

  const renderTableData = () => {
    const dataToRender = searchedData.length > 0 ? searchedData : tableData;

    const highlightCellContent = (text, header) => {
      if (headerForSearch === header) {
        return highlightSearch(text); // Highlight the search result
      }
      return text;
    };

    return tableData.length > 0 && showTableData ? (
      dataToRender.map((rowData, rowIndex) => (
        <TableRow key={rowIndex}>
          <TableCell size="small">
            <Checkbox
              checked={selectedRowData.includes(rowData)}
              onChange={() => handleRowSelect(rowData)}
              style={{ color: "black" }}
            />
          </TableCell>
          {tableHeaders?.map((header) => (
            <React.Fragment key={header}>
              {(header === "HEADLINE" ||
                header === "REPORTING SUBJECT" ||
                header === "DETAIL SUMMARY" ||
                header === "KEYWORD") && (
                <TableCell>
                  <Tooltip
                    title={rowData[header.toLowerCase().replace(/ /g, "_")]}
                    placement="top"
                    enterDelay={1000}
                    leaveDelay={200}
                    TransitionProps={{ timeout: 1500 }}
                  >
                    <div
                      style={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 3,
                      }}
                      className={`text-xs w-28 text-black overflow-hidden whitespace-normal " ${
                        (header === "REPORTING SUBJECT" && "w-16") ||
                        (header === "HEADLINE" && "w-72") ||
                        (header === "DETAIL SUMMARY" && "w-72")
                      }`}
                    >
                      {highlightCellContent(
                        rowData[header.toLowerCase().replace(/ /g, "_")],
                        header.toLowerCase().replace(/ /g, "_")
                      )}
                    </div>
                  </Tooltip>
                </TableCell>
              )}
              {header !== "HEADLINE" &&
                header !== "REPORTING SUBJECT" &&
                header !== "DETAIL SUMMARY" &&
                header !== "KEYWORD" && (
                  <TableCell className="table-cell" size="small">
                    <div
                      className="text-xs w-16 text-black overflow-hidden whitespace-normal"
                      style={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 3,
                      }}
                    >
                      {highlightCellContent(
                        rowData[header.toLowerCase().replace(/ /g, "_")],
                        header.toLowerCase().replace(/ /g, "_")
                      )}
                    </div>
                  </TableCell>
                )}
            </React.Fragment>
          ))}
        </TableRow>
      ))
    ) : (
      <table className="bg-primary w-screen border h-screen text-gray-400 text-sm text-center py-4">
        No table Data
      </table>
    );
  };

  return (
    <div>
      {/* filters for editing the cells */}
      <div className="flex items-center gap-2 ml-2">
        {/* search values using dropdown */}
        <FormControl className="w-28">
          <Select
            className={classes.dropDowns}
            value={headerForSearch}
            onChange={hanleTableSearchUsingHeader}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            MenuProps={{ PaperProps: { style: { height: 200 } } }}
          >
            <MenuItem value="" disabled>
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
        <TextField
          placeholder="Find Text"
          variant="outlined"
          size="small"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{ style: { fontSize: "0.8rem", height: 25, top: 6 } }}
        />
        <Button btnText={"Find"} onClick={handleSearch} />
      </div>
      <hr className="mt-1" />
      <div className="mt-2 ml-2 flex items-center flex-wrap gap-4">
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
            <MenuItem value="" disabled>
              <em>Select</em>
            </MenuItem>
            <MenuItem value="detail_summary" sx={{ fontSize: "0.8em" }}>
              Summary
            </MenuItem>
          </Select>
        </FormControl>
        <TextField
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          size="small"
          variant="outlined"
          InputProps={{ style: { fontSize: "0.8rem", height: 25, top: 6 } }}
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

      {/* main table */}
      <div className="mt-4 overflow-scroll h-screen">
        <table>
          <thead>
            <tr className="sticky top-0 bg-[#150734]">
              {showTableData && (
                <TableCell size="small">
                  <Checkbox
                    checked={selectedRowData.length === tableData.length}
                    onChange={handleMasterCheckboxChange}
                    className={classes.headerCheckBox}
                  />
                </TableCell>
              )}

              {showTableData &&
                tableHeaders?.map((header) => (
                  <td
                    key={header}
                    onClick={() =>
                      handleSort(header.toLowerCase().replace(/ /g, "_"))
                    }
                    className={
                      "text-white cursor-pointer font-thin text-sm tracking-wider border-1 p-2"
                    }
                  >
                    <span className="flex items-center">
                      <IoIosArrowRoundUp
                        style={{
                          color:
                            sortColumn ===
                              header.toLowerCase().replace(/ /g, "_") &&
                            sortDirection === "asc"
                              ? "red"
                              : "white",
                        }}
                      />
                      <IoIosArrowRoundDown
                        style={{
                          color:
                            sortColumn ===
                              header.toLowerCase().replace(/ /g, "_") &&
                            sortDirection === "desc"
                              ? "red"
                              : "white",
                        }}
                      />
                    </span>
                    {getHeaderAbbreviation(header)}
                  </td>
                ))}
            </tr>
          </thead>

          <tbody className="bg-[#e6e1e1]">{renderTableData()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default ResearchTable;
