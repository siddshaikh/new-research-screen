import axios from "axios";

const handlePostData = async (
  updatedRows,
  company,
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
  userToken
) => {
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
    KEYWORD: row.keyword,
    MODIFIEDBY: name,
    MODIFIEDON: currentDateWithTime,
    PROMINENCE: row.prominence,
    REPORTINGSUBJECT: row.reporting_subject,
    REPORTINGTONE: row.reporting_tone,
    SOCIALFEEDID: row.social_feed_id,
    SUBCATEGORY: row.subcategory,
    HEADLINE: row.headline,
    HEADSUMMARY: row.headsummary,
    AUTHOR: row.author_name,
    REMARKS: row.remarks,
  }));

  try {
    const url = `http://51.68.220.77:8000/update2databaseTemp/`; //update2database
    if (dataToSending.length > 0) {
      await axios.post(url, dataToSending, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
      });
      setUpdatedRows([]);
      setPostingLoading(false);
      setSuccessMessage("Data updated successfully!");
      setSelectedRowData([]);
      // Clearing the dropdown values
      setReportingTone("");
      setSubject("");
      setCategory("");
      setProminence("");
      setUnsavedChanges(false);
      setEditValue("");
      setEditRow("");
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

export default handlePostData;
