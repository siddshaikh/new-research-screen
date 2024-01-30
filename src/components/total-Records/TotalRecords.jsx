import PropTypes from "prop-types";

const TotalRecords = ({ searchedData, tableData }) => {
  const dataToShow =
    searchedData.length > 0 ? searchedData.length : tableData.length;

  return (
    <div className="bg-primary text-white mt-2 mb-4">
      Total Records: {dataToShow}
    </div>
  );
};

TotalRecords.propTypes = {
  searchedData: PropTypes.array.isRequired,
  tableData: PropTypes.array.isRequired,
};

export default TotalRecords;
