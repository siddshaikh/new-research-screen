import { useContext, useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ResearchContext } from "../../context/ContextProvider";
import useFetchData from "../../hooks/useFetchData";
import { toast } from "react-toastify";
import Button from "../custom/Button";
import TableDropdown from "../dropdowns/TableDropdown";
import Loader from "../loader/Loader";
import TextFields from "../TextFields/TextField";
import MainTable from "../table/MainTable";
import PropTypes from "prop-types";
import handlePostData from "../../utils/handlePost";
import FirstFind from "../research-dropdowns/table-dropdowns/FirstFind";
import TableRadio from "../table-radio/TableRadio";
import SecondFind from "../research-dropdowns/table-dropdowns/SecondFind";
import HeaderForEdits from "../research-dropdowns/table-dropdowns/HeaderForEdits";
import SubjectSearchable from "../research-dropdowns/table-dropdowns/SubjectSearchable";
import SearchableCategory from "../research-dropdowns/table-dropdowns/SearchableCategory";
// import DeleteTableData from "../deleteData/DeleteTableData";
import Pagination from "../../components/pagination/Pagination";

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
const ResearchTable = ({
  tableDataLoading,
  tableData,
  setTableData,
  company,
  companies,
  companyId,
  setCompanyId,
}) => {
  const classes = useStyles();
  // context values
  const { name, userToken, setUnsavedChanges } = useContext(ResearchContext);

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
  const [applyLoading, setApplyLoading] = useState(false);
  // loading state for checkbox selection
  // data for the edit
  const [editValue, setEditValue] = useState("");
  // Function to fetch table data
  // updatedrows
  const [updatedRows, setUpdatedRows] = useState([]);
  // for highlight purpose
  const [highlightUpdatedRows, setHighlightUpdatedRows] = useState([]);
  // saved success
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
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
  const handleTableSearchUsingHeader = (event) => {
    setHeaderForSearch(event.target.value);
    setSearchValue("");
    setSelectedRadioValue(null);
    setSecondHeaderForSearch("");
    setSecondSearchValue("");
  };
  const handleSecondSearchUsingHeader = (event) => {
    if (!selectedRadioValue) {
      toast.warning("Please select AND or OR condition first!", {
        autoClose: 2000,
      });
      return;
    }
    setSecondHeaderForSearch(event.target.value);
    setSecondSearchValue("");
  };
  // radio change
  const handleChange = (event) => {
    if (!headerForSearch) {
      toast.error("Please Select a Header first", {
        autoClose: 2000,
      });
      return;
    }
    setSelectedRadioValue(event.target.value);
  };

  // handle editrow change
  const handleEditRowChange = (e) => {
    const { value } = e.target;
    setEditRow(value);
    setEditValue("");
  };
  //updating tabledata
  const handleApplyChanges = () => {
    setApplyLoading(true);
    if (selectedRowData.length > 0) {
      const updatedSelectedRows = selectedRowData.map((row) => ({
        ...row,
        reporting_tone: reportingTone || row.reporting_tone,
        reporting_subject: subject || row.reporting_subject,
        subcategory: category || row.subcategory,
        prominence: prominence || row.prominence,
        detail_summary:
          (editRow === "detail_summary" && editValue) || row.detail_summary,
        headline: (editRow === "headline" && editValue) || row.headline,
        headsummary:
          (editRow === "headsummary" && editValue) || row.headsummary,
        author_name:
          (editRow === "author_name" && editValue) || row.author_name,
        keyword: (editRow === "keyword" && editValue) || row.keyword,
        remarks: (editRow === "remarks" && editValue) || row.remarks,
      }));

      const updatedTableData = tableData.map((row) => {
        const updatedRow = updatedSelectedRows.find(
          (selectedRow) =>
            selectedRow.social_feed_id === row.social_feed_id &&
            selectedRow.company_id === row.company_id
        );
        return updatedRow || row;
      });

      // Update only the items that exist in selectedRowData in both searchedData and tableData
      const updatedSearchedData = searchedData.map((row) => {
        const updatedRow = updatedSelectedRows.find(
          (selectedRow) =>
            selectedRow.social_feed_id === row.social_feed_id &&
            selectedRow.company_id === row.company_id
        );
        return updatedRow || row;
      });

      setUpdatedRows(updatedSelectedRows);
      // hightlight purpose(setHighlightUPdatedRows)
      setHighlightUpdatedRows((prev) => [...prev, ...updatedSelectedRows]);

      setTableData(updatedTableData);
      setSearchedData(updatedSearchedData);
      setUnsavedChanges(true);
    } else {
      toast.warning("Please select at least one item to update", {
        autoClose: 3000,
      });
    }
    setApplyLoading(false);
    setSelectedRowData([]);
  };
  const handleSearch = () => {
    if (selectedRowData.length > 0) {
      var userChoice = confirm("Do you want to uncheck previous selection?");

      if (userChoice) {
        setSelectedRowData([]);
      }
    }
    setTableLoading(true);
    let output = [];

    if (headerForSearch === "all") {
      // Search across all data
      output = tableData.filter((rowData) => {
        const allRowValues = Object.values(rowData).join(" ").toLowerCase();
        return allRowValues.includes(searchValue.toLowerCase());
      });

      if (output.length === 0) {
        output = tableData;
        toast.warning("No results found. Showing all data.", {
          autoClose: 2000,
        });
      }
    } else if (headerForSearch !== "all" && !secondHeaderForSearch) {
      // Implement logic for searching within a specific header when only one header is chosen
      output = tableData.filter((rowData) => {
        const specificRowValue = (rowData[headerForSearch] ?? "")
          .toString()
          .toLowerCase();
        return specificRowValue.includes(searchValue.toLowerCase());
      });

      if (output.length === 0) {
        toast.warning("No results found. Showing all data.", {
          autoClose: 2000,
        });
        output = tableData; // Show all data when no matching rows are found
      }
    } else if (headerForSearch !== "all" && secondHeaderForSearch === "all") {
      if (!selectedRadioValue) {
        // No AND or OR condition selected
        toast.warning("Please select AND or OR condition first!", {
          autoClose: 2000,
        });
        output = [...tableData];
      } else {
        output = tableData.filter((rowData) => {
          const firstHeaderValue = (rowData[headerForSearch] ?? "")
            .toString()
            .toLowerCase();
          const secondRowValues = Object.values(rowData)
            .join(" ")
            .toLowerCase();

          const firstCondition = firstHeaderValue.includes(
            searchValue.toLowerCase()
          );
          const secondCondition = secondRowValues.includes(
            secondSearchValue.toLowerCase()
          );

          if (selectedRadioValue === "and") {
            return firstCondition && secondCondition;
          } else if (selectedRadioValue === "or") {
            return firstCondition || secondCondition;
          }
          return true; // Include all rows if no condition is selected
        });

        if (output.length === 0) {
          toast.warning("No results found. Showing all data.", {
            autoClose: 2000,
          });
          output = tableData; // Show all data when no matching rows are found
        }
      }
      // eslint-disable-next-line no-dupe-else-if
    } else if (headerForSearch === "all" && secondHeaderForSearch === "all") {
      if (!selectedRadioValue) {
        toast.warning("Please select AND or OR condition first!", {
          autoClose: 2000,
        });
        output = [...tableData];
      } else {
        const searchCriteria = (rowData) => {
          const allRowValues = Object.values(rowData).join(" ").toLowerCase();

          const firstCondition = allRowValues.includes(
            searchValue.toLowerCase()
          );
          const secondCondition = allRowValues.includes(
            secondSearchValue.toLowerCase()
          );

          return selectedRadioValue === "and"
            ? firstCondition && secondCondition
            : firstCondition || secondCondition;
        };

        output = tableData.filter(searchCriteria);

        if (output.length === 0) {
          toast.warning("No results found. Showing all data.", {
            autoClose: 2000,
          });
          output = tableData; // Show all data when no matching rows are found
        }
      }
    } else if (
      headerForSearch !== "all" &&
      secondHeaderForSearch !== "all" &&
      headerForSearch === secondHeaderForSearch
    ) {
      // Logic for searching with the same headers
      if (!selectedRadioValue) {
        // No AND or OR condition selected
        toast.warning("Please select AND or OR condition first!", {
          autoClose: 2000,
        });
        output = [...tableData];
      } else {
        output = tableData.filter((rowData) => {
          const specificRowValue = (rowData[headerForSearch] ?? "")
            .toString()
            .toLowerCase();

          const firstCondition = specificRowValue.includes(
            searchValue.toLowerCase()
          );
          const secondCondition = specificRowValue.includes(
            secondSearchValue.toLowerCase()
          );

          if (selectedRadioValue === "and") {
            return firstCondition && secondCondition;
          } else if (selectedRadioValue === "or") {
            return firstCondition || secondCondition;
          }
          return true; // Include all rows if no condition is selected
        });

        if (output.length === 0) {
          toast.warning("No results found. Showing all data.", {
            autoClose: 2000,
          });
          output = tableData; // Show all data when no matching rows are found
        }
      }
    } else if (
      headerForSearch !== "all" &&
      secondHeaderForSearch !== "all" &&
      headerForSearch !== secondHeaderForSearch
    ) {
      // Logic for searching with different headers
      output = tableData.filter((rowData) => {
        const firstHeaderValue = (rowData[headerForSearch] ?? "")
          .toString()
          .toLowerCase();
        const secondHeaderValue = (rowData[secondHeaderForSearch] ?? "")
          .toString()
          .toLowerCase();

        // Implement logic for different headers including 'all' using AND and OR conditions
        if (selectedRadioValue === "and") {
          // Implement logic for AND condition for different headers
          return (
            firstHeaderValue.includes(searchValue.toLowerCase()) &&
            secondHeaderValue.includes(secondSearchValue.toLowerCase())
          );
        } else if (selectedRadioValue === "or") {
          // Implement logic for OR condition for different headers
          return (
            firstHeaderValue.includes(searchValue.toLowerCase()) ||
            secondHeaderValue.includes(secondSearchValue.toLowerCase())
          );
        }
        return true; // Include all rows if no condition is selected
      });

      if (output.length === 0) {
        toast.warning("No results found. Showing all data.", {
          autoClose: 2000,
        });
        output = tableData; // Show all data when no matching rows are found
      }
    }

    // Set the output to searchedData and handle loading state
    setSearchedData(output);
    setTableLoading(false);
  };
  // getting current date with time for the posting data to database
  useEffect(() => {
    const dateNow = new Date();
    const formattedDate = dateNow.toISOString().slice(0, 19).replace("T", " ");
    setCurrentDateWithTime(formattedDate);
  }, []);

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
  const loadingLoader =
    sortLoading || applyLoading || tableLoading || tableDataLoading;
  return (
    <div className="relative">
      {loadingLoader && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200 bg-opacity-50 z-50">
          <Loader />
        </div>
      )}
      {/* filters for editing the cells */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* first find */}
        <FirstFind
          classes={classes}
          headerForSearch={headerForSearch}
          handleTableSearchUsingHeader={handleTableSearchUsingHeader}
        />
        {/* searchfield for the searching tableData */}
        <TextFields
          placeholder={"Find Text"}
          value={searchValue}
          setValue={setSearchValue}
          width="200"
        />
        {/* radio button */}
        <TableRadio
          selectedRadioValue={selectedRadioValue}
          handleChange={handleChange}
        />
        {/* second find */}
        <SecondFind
          classes={classes}
          secondHeaderForSearch={secondHeaderForSearch}
          handleSecondSearchUsingHeader={handleSecondSearchUsingHeader}
          headerForSearch={headerForSearch}
        />
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
        <div className="mt-1 flex items-center gap-2">
          <SubjectSearchable
            width={120}
            subjects={subjects}
            label={"Subject"}
            setSubject={setSubject}
            subject={subject}
          />
          <SearchableCategory
            categories={categories}
            label={"Category"}
            setCategory={setCategory}
            category={category}
            width={120}
          />{" "}
        </div>
        <Button
          btnText={applyLoading ? "Applying" : "Apply"}
          onClick={handleApplyChanges}
        />
        <button
          className={` bg-primary border border-gray-400 rounded px-10 mt-3 uppercase text-white tracking-wider ${
            postingLoading ? "text-yellow-300" : "text-white"
          }`}
          onClick={() =>
            handlePostData(
              updatedRows,
              name,
              currentDateWithTime,
              setSavedSuccess,
              setPostingLoading,
              setUpdatedRows,
              setSuccessMessage,
              setSelectedRowData,
              setReportingTone,
              setSubject,
              setCategory,
              setProminence,
              setUnsavedChanges,
              setEditValue,
              setEditRow,
              userToken,
              setHighlightUpdatedRows
            )
          }
        >
          {postingLoading ? "Loading..." : "Save"}
        </button>
        {/* {selectedRowData.length > 0 && <DeleteTableData />} */}
        {/* saved or not */}
        <div>
          {savedSuccess && (
            <Typography className="text-primary">{successMessage}</Typography>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {/* dropdown headers ofr edit*/}
        <HeaderForEdits
          editRow={editRow}
          handleEditRowChange={handleEditRowChange}
          classes={classes}
        />
        <span className="mt-3">
          <input
            placeholder="select a summary"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="bg-secondory border-gray-300 border-2 rounded-md px-4 outline-none md:w-[1300px] sm:w-full"
          />
        </span>
      </div>
      {/* pagination */}
      {tableData.length > 0 && <Pagination tableData={tableData} />}
      <MainTable
        searchedData={searchedData}
        selectedRowData={selectedRowData}
        setSelectedRowData={setSelectedRowData}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        setSortColumn={setSortColumn}
        tableData={tableData}
        updatedRows={updatedRows}
        highlightUpdatedRows={highlightUpdatedRows}
      />
    </div>
  );
};

ResearchTable.propTypes = {
  tableDataLoading: PropTypes.bool.isRequired,
  tableData: PropTypes.array.isRequired,
  setTableData: PropTypes.func.isRequired,
  company: PropTypes.string.isRequired,
  companies: PropTypes.array.isRequired,
  companyId: PropTypes.array.isRequired,
  setCompanyId: PropTypes.func.isRequired,
};
export default ResearchTable;
