import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { url } from "../constants/baseUrl";

export const ResearchContext = createContext(null);
const ContextProvider = ({ children }) => {
  const navigate = useNavigate();
  // auto logout
  const [logoutTimer, setLogoutTimer] = useState(null);
  const [userToken, setUserToken] = useState("");

  //state for the login component
  const [researchOpen, setResearchOpen] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  // for logout timer
  const [timerId, setTimerId] = useState(null);
  // loading state while fetching tableData
  // fetching table data using client and companyid and multiple params
  const [tableFetchLoading, setTableFetchLoading] = useState(false);
  // table headers in uppercase
  const [tableHeaders, setTableHeaders] = useState([]);

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const nextDay = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
  const formattedDate = new Date(
    currentDate.getTime() - currentDate.getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 16)
    .replace("T", " ");
  const formattedNextDay = new Date(
    nextDay.getTime() - nextDay.getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 16)
    .replace("T", " ");

  const [fromDate, setFromDate] = useState(formattedDate);
  const [dateNow, setDateNow] = useState(formattedNextDay);
  // dates end
  // pagination
  const [pageNumber, setPageNumber] = useState(1);
  const recordsPerPage = 800;
  const [showTableData, setShowTableData] = useState(false);

  // if user forgot the save the data after apply changes in  table
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  // qc2print
  const [qc2Open, setQc2Open] = useState(false);
  const [qc2PrintTableData, setQc2PrintTableData] = useState([]);
  // when seearch direct move to table

  const handleLogout = () => {
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
    setUserToken("");
    localStorage.removeItem("user");
    setUnsavedChanges(false);
    setPageNumber(1);
    navigate("/login");
  };
  const getAutoToken = async () => {
    try {
      const res = await axios.post(`${url}authenticate/`, {
        loginname: name,
        password: password,
      });
      localStorage.setItem("user", res.data.access_token);
      setUserToken(localStorage.getItem("user"));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setUserToken("");
      getAutoToken();
    }, 30 * 60 * 1000);
    setLogoutTimer(timer);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [userToken]);
  return (
    <ResearchContext.Provider
      value={{
        handleLogout,
        researchOpen,
        setResearchOpen,
        name,
        setName,
        password,
        setPassword,
        setUserToken,
        userToken,
        timerId,
        setTimerId,
        fromDate,
        setFromDate,
        dateNow,
        setDateNow,
        tableFetchLoading,
        setTableFetchLoading,
        showTableData,
        setShowTableData,
        tableHeaders,
        setTableHeaders,
        // data saved or not
        unsavedChanges,
        setUnsavedChanges,
        // Pagination
        pageNumber,
        setPageNumber,
        recordsPerPage,
        // qc2print
        qc2Open,
        setQc2Open,
        qc2PrintTableData,
        setQc2PrintTableData,
      }}
    >
      {children}
    </ResearchContext.Provider>
  );
};
ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export default ContextProvider;
