import { makeStyles } from "@mui/styles";
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";
import getHeaderAbbreviation from "../../utils/concatHeader";
import React, { memo, useContext } from "react";
import PropTypes from "prop-types";
import { Checkbox, TableCell, TableRow, Tooltip } from "@mui/material";
import { ResearchContext } from "../../context/ContextProvider";

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
const MainTable = ({
  searchedData,
  selectedRowData,
  setSelectedRowData,
  sortColumn,
  sortDirection,
  setSortDirection,
  setSortColumn,
}) => {
  const { tableHeaders, tableData, showTableData } =
    useContext(ResearchContext);
  const classes = useStyles();
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
      const allSearchedSelected =
        selectedRowData.length === searchedData.length;

      if (allSearchedSelected) {
        setSelectedRowData([]);
      } else {
        setSelectedRowData([...searchedData]);
      }
    } else {
      setSelectedRowData(allSelected ? [] : [...tableData]);
    }
  };

  const handleSort = (clickedHeader) => {
    if (sortColumn === clickedHeader) {
      setSortDirection((prevSortDirection) =>
        prevSortDirection === "asc" ? "desc" : "asc"
      );
    } else {
      setSortColumn(clickedHeader);
      setSortDirection("asc");
    }
  };
  // const highlightSearch = (text, header) => {
  //   if (
  //     ((headerForSearch === header && searchValue.trim()) ||
  //       (secondHeaderForSearch === header && secondSearchValue.trim())) &&
  //     text
  //   ) {
  //     const searchRegex = new RegExp(
  //       `(${headerForSearch === header ? searchValue : secondSearchValue})`,
  //       "gi"
  //     );
  //     const parts = text.split(searchRegex);

  //     return parts.map((part, index) => {
  //       if (searchRegex.test(part)) {
  //         return (
  //           <span
  //             key={index}
  //             className={`text-white ${
  //               headerForSearch === header
  //                 ? "bg-yellow-400"
  //                 : "bg-gray-500" ||
  //                   (headerForSearch === "all" && "bg-blue-500")
  //             }`}
  //           >
  //             {part}
  //           </span>
  //         );
  //       } else {
  //         return part;
  //       }
  //     });
  //   }

  //   return text;
  // };
  const renderTableData = () => {
    const dataToRender = searchedData.length > 0 ? searchedData : tableData;

    return tableData.length > 0 && showTableData ? (
      dataToRender.map((rowData, rowIndex) => (
        <TableRow key={rowIndex}>
          <TableCell
            size="small"
            padding="checkbox"
            style={{
              position: "sticky",
              top: 28,
              backgroundColor: "#e6e1e1",
              fontSize: "0.8em",
            }}
            sx={{
              padding: "10px",
            }}
          >
            <Checkbox
              size="small"
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
                <TableCell
                  sx={{
                    padding: "10px",
                  }}
                >
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
                        WebkitLineClamp: 2,
                        fontSize: "0.8em",
                        fontWeight: "bold",
                      }}
                      className={`text-xs w-28 text-black overflow-hidden whitespace-normal" ${
                        (header === "REPORTING SUBJECT" && "w-16") ||
                        (header === "HEADLINE" && "w-72") ||
                        (header === "DETAIL SUMMARY" && "w-[25rem]")
                      }`}
                    >
                      {/* {highlightFlag
                        ? highlightSearch(
                            rowData[header.toLowerCase().replace(/ /g, "_")],
                            header.toLowerCase().replace(/ /g, "_")
                          )
                        : */}
                      {rowData[header.toLowerCase().replace(/ /g, "_")]}
                    </div>
                  </Tooltip>
                </TableCell>
              )}
              {header !== "HEADLINE" &&
                header !== "REPORTING SUBJECT" &&
                header !== "DETAIL SUMMARY" &&
                header !== "KEYWORD" && (
                  <TableCell size="small">
                    <div
                      className="text-xs w-16 text-black overflow-hidden whitespace-normal mx-3"
                      style={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                        marginLeft: -3,
                        fontSize: "0.8em",
                        fontWeight: "bold",
                      }}
                    >
                      {/* {highlightFlag
                        ? highlightSearch(
                            rowData[header.toLowerCase().replace(/ /g, "_")],
                            header.toLowerCase().replace(/ /g, "_")
                          )
                        : rowData[header.toLowerCase().replace(/ /g, "_")]} */}
                      {rowData[header.toLowerCase().replace(/ /g, "_")]}
                    </div>
                  </TableCell>
                )}
            </React.Fragment>
          ))}
        </TableRow>
      ))
    ) : (
      <table className="bg-primary w-screen border h-screen text-gray-400 text-sm text-center py-4"></table>
    );
  };
  return (
    <div className="mt-2 overflow-scroll h-screen">
      <table>
        <thead>
          <tr className="sticky left-0 top-0 bg-[#150734]">
            {" "}
            {tableHeaders?.length > 0 && (
              <td style={{ display: "flex", justifyItems: "center" }}>
                <input
                  type="checkbox"
                  style={{
                    width: "17px",
                    height: "17px",
                    marginLeft: "1rem",
                    marginTop: "0.5rem",
                  }}
                  checked={selectedRowData?.length === tableData.length}
                  onChange={handleMasterCheckboxChange}
                  className={classes.headerCheckBox}
                />
              </td>
            )}
            {showTableData &&
              tableHeaders?.map((header) => (
                <td
                  key={header}
                  onClick={() =>
                    handleSort(header.toLowerCase().replace(/ /g, "_"))
                  }
                  className={
                    "text-white cursor-pointer font-thin text-xs tracking-widest"
                  }
                >
                  <span className="flex items-center text-sm">
                    <IoIosArrowRoundUp
                      style={{
                        fontSize: "x-small",
                        color:
                          sortColumn ===
                            header.toLowerCase().replace(/ /g, "_") &&
                          sortDirection === "asc"
                            ? "red"
                            : "#fff",
                      }}
                    />
                    <IoIosArrowRoundDown
                      style={{
                        fontSize: "x-small",
                        color:
                          sortColumn ===
                            header.toLowerCase().replace(/ /g, "_") &&
                          sortDirection === "desc"
                            ? "red"
                            : "#fff",
                      }}
                    />
                  </span>
                  <span className="ml-2">{getHeaderAbbreviation(header)}</span>
                </td>
              ))}
          </tr>
        </thead>

        <tbody className="bg-[#e6e1e1]">{renderTableData()}</tbody>
      </table>
    </div>
  );
};
MainTable.propTypes = {
  selectedRowData: PropTypes.array,
  sortColumn: PropTypes.string,
  sortDirection: PropTypes.oneOf(["asc", "desc"]),
  searchedData: PropTypes.array,
  setSelectedRowData: PropTypes.func,
  setSortDirection: PropTypes.func,
  setSortColumn: PropTypes.func,
  tableHeaders: PropTypes.array,
  tableData: PropTypes.array,
  showTableData: PropTypes.bool,
};
export default memo(MainTable);
