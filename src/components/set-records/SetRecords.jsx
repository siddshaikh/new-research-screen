import PropTypes from "prop-types";
import { recordsPerPage } from "../../constants/dataArray";
import { toast } from "react-toastify";

const SetRecords = ({ records, setRecords, pageNumber }) => {
  const handleChange = (e) => {
    let value = Number(e.target.value);
    if (pageNumber !== 1) return toast.warning("Please Move on First Page");
    setRecords(value);
  };

  return (
    <select
      value={records}
      onChange={handleChange}
      aria-label="Select"
      className="outline-none border border-black mx-2"
    >
      {recordsPerPage.map((record) => (
        <option key={record} value={record}>
          {record}
        </option>
      ))}
    </select>
  );
};

SetRecords.propTypes = {
  records: PropTypes.number.isRequired,
  setRecords: PropTypes.func.isRequired,
  pageNumber: PropTypes.number.isRequired,
};

export default SetRecords;
