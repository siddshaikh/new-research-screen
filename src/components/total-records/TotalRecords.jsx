import PropTypes from "prop-types";

const TotalRecords = ({ totalRecordsCount }) => {
  return (
    <div className="bg-primary text-white text-[0.9em] px-2 rounded-md mt-2">
      Showing {totalRecordsCount} Records.
    </div>
  );
};

TotalRecords.propTypes = {
  totalRecordsCount: PropTypes.number,
};

export default TotalRecords;
