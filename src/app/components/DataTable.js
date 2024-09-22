import Skeleton from "./Skeleton";
import { Parser } from "json2csv"; // Import json2csv

const DataTable = ({ isLoading, tableData, handleDataChange }) => {
  const keyMapping = {
    deal_name: "Deal Name",
    total_deal_amount: "Total Deal Amount",
    start_date: "Start Date",
    end_date: "End Date",
    description: "Description",
    campaign_objective: "Campaign Objective",
    campaign_kpis: "Campaign KPI(s)",
    target_audience: "Target Audience",
    geo_targeting: "Geo Targeting",
    assets_available: "Assets Available",
    viewability: "Viewability",
    ad_fraud_monitoring: "Ad Fraud Monitoring",
    ad_blocking: "Ad Blocking",
  };

  const downloadCSV = () => {
    const csvData = Object.keys(keyMapping).map((key) => {
      return {
        Field: keyMapping[key], // Use the friendly name
        Value: `"${
          Array.isArray(tableData[key])
            ? tableData[key].join(" | ") // Handle array values
            : tableData[key] || ""
        }"`, // Always wrap the value in quotes for consistency
      };
    });

    // Define the fields and parse the data into CSV format
    const fields = ["Field", "Value"];
    const parser = new Parser({ fields });
    const csv = parser.parse(csvData);

    // Create blob and trigger download
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "tableData.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <tbody>
          {isLoading ? (
            <>
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </>
          ) : (
            Object.keys(tableData).map(
              (key) =>
                !["_id", "createdAt", "updatedAt"].includes(key) && (
                  <tr
                    key={key}
                    className="hover:bg-gray-100 transition duration-200"
                  >
                    <td className="border border-gray-300 px-1 text-center whitespace-nowrap">
                      {keyMapping[key]}
                    </td>
                    <td className="border border-gray-300 px-2 w-5/6">
                      <input
                        className="border p-1 w-full rounded-md focus:ring-2 focus:ring-blue-500"
                        value={
                          Array.isArray(tableData[key])
                            ? tableData[key].join(" | ")
                            : tableData[key]
                        }
                        onChange={(e) => handleDataChange(e, key)}
                      />
                    </td>
                  </tr>
                )
            )
          )}
        </tbody>
      </table>
      <div className="flex">
        <button
          onClick={downloadCSV}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
        >
          Download CSV
        </button>
      </div>
    </>
  );
};

export default DataTable;
