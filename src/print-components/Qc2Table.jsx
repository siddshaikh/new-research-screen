import { useContext, useEffect, useState } from "react";
import { Tooltip } from "@mui/material";
import { ResearchContext } from "../context/ContextProvider";

const Qc2Table = () => {
  const { qc2PrintTableData, setQc2PrintTableData } =
    useContext(ResearchContext);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  // tableheaders
  const [tableHeaders, setTableHeaders] = useState([]);
  useEffect(() => {
    if (qc2PrintTableData && qc2PrintTableData.length > 0) {
      const header = Object.keys(qc2PrintTableData[0]);
      setTableHeaders(header);
    }
  }, [qc2PrintTableData]);
  useEffect(() => {
    if (selectAll) {
      const allArticalIds = qc2PrintTableData.map((data) => data.artical_id);
      setSelectedItems(allArticalIds);
    } else {
      setSelectedItems([]);
    }
  }, [selectAll]);

  const handleMasterCheckboxChange = (e) => {
    setSelectAll(e.target.checked);
  };

  const handleCheckboxChange = (e, articalId) => {
    const checked = e.target.checked;

    if (checked) {
      setSelectedItems((prevSelected) => [...prevSelected, articalId]);
    } else {
      setSelectedItems((prevSelected) =>
        prevSelected.filter((item) => item !== articalId)
      );
    }
    setSelectAll(false);
  };
  // sorting a tableData
  const sortTableData = (header) => {
    if (qc2PrintTableData.length > 0) {
      const sortedData = [...qc2PrintTableData].sort((a, b) => {
        if (a[header] < b[header]) return -1;
        if (a[header] > b[header]) return 1;
        return 0;
      });
      setQc2PrintTableData(sortedData);
    }
  };
  return (
    <div className="flex flex-col h-screen overflow-scroll">
      <div className="-my-2 sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
            {qc2PrintTableData.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleMasterCheckboxChange}
                      />
                    </th>
                    {tableHeaders.map((item) => (
                      <th
                        key={item}
                        scope="col"
                        className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer`}
                        onClick={() => sortTableData(item)}
                      >
                        {item}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {qc2PrintTableData.map((items) => (
                    <tr key={items.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={
                            selectAll ||
                            selectedItems.includes(items.article_id)
                          }
                          onChange={(e) =>
                            handleCheckboxChange(e, items.article_id)
                          }
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {items.client_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {items.company_name}
                      </td>
                      <Tooltip placement="top" title={items.headline}>
                        <td className="px-6 py-4 overflow-hidden whitespace-nowrap">
                          <div className="w-48 truncate">{items.headline}</div>
                        </td>
                      </Tooltip>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {items.journalist}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {items.publication_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {items.keyword}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {items.reporting_tone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {items.prominence}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {items.manual_prominence}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {items.system_prominence}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {items.reporting_subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {items.subcategory}
                      </td>
                      <Tooltip placement="top" title={items.detail_summary}>
                        <td className="px-6 py-4 overflow-hidden whitespace-nowrap">
                          <div className="w-48 truncate">
                            {items.detail_summary}
                          </div>
                        </td>
                      </Tooltip>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {items.total_space}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {items.space}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {items.box}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {items.box_value}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {items.page_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {items.page_value}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {items.city_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {items.artical_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {items.artical_date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {items.upload_date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {items.qc1_by}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {items.qc1_on}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {items.qc2_by}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {items.qc2_on}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <span className="block mt-2 text-center">No Data Found.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Qc2Table;
