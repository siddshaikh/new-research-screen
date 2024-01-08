import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

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
  // clientId for the fetching company
  const [clientId, setClientId] = useState("");
  // company setting when getting clientId from the clients
  const [company, setCompany] = useState([]);
  // selected compnies
  const [companies, setCompanies] = useState([]);
  // loading state while fetching tableData
  const [companyId, setCompanyId] = useState([]);
  // fetching table data using client and companyid and multiple params
  const [tableData, setTableData] = useState([]);
  const [tableFetchLoading, setTableFetchLoading] = useState(false);
  // table headers in uppercase
  const [tableHeaders, setTableHeaders] = useState([]);

  // search text
  // const [searchValue, setSearchValue] = useState("");
  // dates
  const currentDate = new Date();

  // Get the date for 24 hours later
  const nextDay = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);

  const formattedDate = currentDate
    .toISOString()
    .slice(0, 16)
    .replace("T", " ");
  const formattedNextDay = nextDay.toISOString().slice(0, 16).replace("T", " ");

  const [fromDate, setFromDate] = useState(formattedDate);
  const [dateNow, setDateNow] = useState(formattedNextDay);

  // dates end
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
    setClientId("");
    setUnsavedChanges(false);
    navigate("/login");
  };
  const getAutoToken = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}authenticate/`,
        {
          loginname: name,
          password: password,
        }
      );
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
      toast.success("New Session Started");
      navigate("/login");
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
        clientId,
        setClientId,
        company,
        setCompany,
        companies,
        setCompanies,
        fromDate,
        setFromDate,
        dateNow,
        setDateNow,
        // searchValue,
        // setSearchValue,
        tableFetchLoading,
        setTableFetchLoading,
        showTableData,
        setShowTableData,
        companyId,
        setCompanyId,
        tableData,
        setTableData,
        tableHeaders,
        setTableHeaders,
        // data saved or not
        unsavedChanges,
        setUnsavedChanges,
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
