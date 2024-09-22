"use client";
import { useState, useEffect } from "react";
import Notification from "./Notification"; // Adjust the path if necessary
import DataTable from "./DataTable";

const CsvUploader = () => {
  const [tableData, setTableData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [isUploading, setUploading] = useState(false);
  const [isTriggerPipeline, setTriggerPipeline] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const fetchData = async () => {
    try {
      const response = await fetch("/dowjones/api/extraction");
      if (!response.ok) throw new Error("Failed to fetch data");
      const { data } = await response.json();

      if (data.length > 0) {
        const recentExtraction = data[0];
        setTableData(recentExtraction);
        setOriginalData(recentExtraction);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      showNotification("Error fetching data: " + error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDataChange = (e, key) => {
    const newData = { ...tableData };
    try {
      newData[key] = JSON.parse(e.target.value);
    } catch (error) {
      newData[key] = e.target.value;
    }
    setTableData(newData);
    setIsDataChanged(JSON.stringify(newData) !== JSON.stringify(originalData));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
  
    if (!selectedFile) {
      showNotification("Please select a file.", "warning");
      return;
    }
  
    setIsLoading(true);
    setUploading(true);
  
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
  
      // Send the file directly to the upload API
      const response = await fetch("/dowjones/api/send-to-s3", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) throw new Error("Failed to upload file");
  
      const data = await response.json();
      showNotification("File uploaded successfully!", "success");
      console.log("Uploaded file URL:", data.Location); // Log or use the uploaded file URL
    } catch (error) {
      console.error("Error uploading file:", error);
      showNotification("File upload failed.", "error");
    } finally {
      fetchData()
      setIsLoading(false);
      setUploading(false);
      setSelectedFile(null)
    }
  };
  
  const handleTriggerPipeline = async(e) => {
    e.preventDefault();
    setTriggerPipeline(true);
  
    try {

      const response = await fetch("/dowjones/api/mutation", {
        method: "POST",
      });
  
      if (!response.ok) throw new Error("Failed to send file");
      const data = await response.json();
      showNotification("File sent successfully!", "success");
    } catch (error) {
      console.error("Error", error);
      showNotification("Data not sent.", "error");
    } finally {
      setTriggerPipeline(false);
    }
  };

  const handleSave = async () => {
    const id = tableData._id;
    const updateData = { ...tableData };

    // Iterate over the keys in updateData and ensure array values are processed correctly
    Object.keys(updateData).forEach((key) => {
      if (
        typeof updateData[key] === "string" &&
        updateData[key].includes("|")
      ) {
        // If the field contains a "|" separator, convert it back to an array
        updateData[key] = updateData[key].split("|").map((item) => item.trim());
      }
    });

    setIsLoading(true);
    try {
      const response = await fetch(`/dowjones/api/extraction?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error("Failed to update data");

      fetchData();
      setIsDataChanged(false);
      showNotification("Data saved successfully!", "success");
    } catch (error) {
      console.error("Error saving data:", error);
      showNotification("Failed to save data.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsLoading(true);
    fetchData();
    showNotification("Data reset successfully!", "success");
  };

  const showNotification = (message, type) => {
    setNotification({ message, type, visible: true });
    setTimeout(
      () => setNotification({ ...notification, visible: false }),
      1000
    );
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-xl text-center font-semibold mb-4">File Extractor</h2>

      <div className="flex justify-between mb-4">
        <div>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="border border-gray-300 rounded-md py-2 px-4 mr-5"
          />
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300"
            onClick={handleFileUpload}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300"
          onClick={handleTriggerPipeline}
        > {isTriggerPipeline ? "Triggering Pipeline..." : "Trigger Pipeline"}
        </button>
      </div>

      <DataTable
        isLoading={isLoading}
        tableData={tableData}
        handleDataChange={handleDataChange}
      />

      <div className="flex justify-between mt-4">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
          onClick={handleReset}
        >
          Reset
        </button>
        <button
          className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 ${
            !isDataChanged ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleSave}
          disabled={!isDataChanged}
        >
          Save
        </button>
      </div>

      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: "", type: "" })}
        />
      )}
    </div>
  );
};

export default CsvUploader;
