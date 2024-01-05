import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const ResearchContext = createContext(null);
const ContextProvider = ({ children }) => {
  const navigate = useNavigate();
  // auto logout
  const [logoutTimer, setLogoutTimer] = useState(null);
  const [userToken, setUserToken] = useState("");

  //state for the login component
  const [researchOpen, setResearchOpen] = useState(false);
  const [name, setName] = useState("");
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

  // data type separate
  const [dateType, setDateType] = useState("article");
  // qc by defaut it will be null
  const [qc1done, setQc1done] = useState(0);
  // qc2done
  const [qc2done, setQc2done] = useState(0);
  // qc1by
  const [qc1by, setQc1by] = useState([]);
  // qc2by
  const [qc2by, setQc2by] = useState([]);
  // image
  const [isImage, setIsImage] = useState(0);
  // video
  const [isVideo, setIsVideo] = useState(0);
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
  //languages
  const [language, setLanguage] = useState([]);
  // selecting continent
  const [continent, setContinent] = useState([]);
  // basis onn the selection of the continent showing th country
  const [country, setCountry] = useState([]);
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
    setQc1by([]);
    setQc2by([]);
    setClientId("");
    setUnsavedChanges(false);
    navigate("/login");
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setUserToken(""); // Clear user token
      localStorage.removeItem("user"); // Remove token from storage
      toast.warning("Session Expired.");
      navigate("/login");
    }, 30 * 60 * 1000); // 30 minutes in milliseconds

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
        qc1done,
        setQc1done,
        qc2done,
        setQc2done,
        qc1by,
        setQc1by,
        qc2by,
        setQc2by,
        isImage,
        setIsImage,
        isVideo,
        setIsVideo,
        // searchValue,
        // setSearchValue,
        tableFetchLoading,
        setTableFetchLoading,
        showTableData,
        setShowTableData,
        dateType,
        setDateType,
        language,
        setLanguage,
        continent,
        setContinent,
        country,
        setCountry,
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
