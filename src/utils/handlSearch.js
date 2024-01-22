export const handleSearch = ({
  selectedRowData,
  setTableLoading,
  setSelectedRowData,
  tableData,
  headerForSearch,
  secondHeaderForSearch,
  searchValue,
  secondSearchValue,
  selectedRadioValue,
  toast,
  setSearchedData,
}) => {
  if (selectedRowData && selectedRowData.length > 0) {
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
        position: toast.POSITION.TOP_CENTER,
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
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
      output = tableData; // Show all data when no matching rows are found
    }
  } else if (headerForSearch !== "all" && secondHeaderForSearch === "all") {
    if (!selectedRadioValue) {
      // No AND or OR condition selected
      toast.warning("Please select AND or OR condition first!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
      output = [...tableData];
    } else {
      output = tableData.filter((rowData) => {
        const firstHeaderValue = (rowData[headerForSearch] ?? "")
          .toString()
          .toLowerCase();
        const secondRowValues = Object.values(rowData).join(" ").toLowerCase();

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
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
        output = tableData; // Show all data when no matching rows are found
      }
    }
    // eslint-disable-next-line no-dupe-else-if
  } else if (headerForSearch === "all" && secondHeaderForSearch === "all") {
    if (!selectedRadioValue) {
      toast.warning("Please select AND or OR condition first!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
      output = [...tableData];
    } else {
      const searchCriteria = (rowData) => {
        const allRowValues = Object.values(rowData).join(" ").toLowerCase();

        const firstCondition = allRowValues.includes(searchValue.toLowerCase());
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
          position: toast.POSITION.TOP_CENTER,
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
        position: toast.POSITION.TOP_CENTER,
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
          position: toast.POSITION.TOP_CENTER,
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
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
      output = tableData; // Show all data when no matching rows are found
    }
  }

  // Set the output to searchedData and handle loading state
  setSearchedData(output);
  setTableLoading(false);
};
