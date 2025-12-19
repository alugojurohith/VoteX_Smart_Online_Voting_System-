import React, { useState, useEffect } from "react";
import axios from "axios";

function VotersList() {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");

  // ================= FETCH VOTERS =================
  useEffect(() => {
    fetchVoters();
  }, []);

  const fetchVoters = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");
      const res = await axios.get(
        "http://localhost:5000/api/admin/voters",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setVoters(res.data.voters || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load voters");
    } finally {
      setLoading(false);
    }
  };

  // ================= FILE SELECT =================
  const handleFileSelect = (file) => {
    setUploadError("");
    setUploadMessage("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const name = file.name.toLowerCase();
    if (!name.endsWith(".xlsx") && !name.endsWith(".xls")) {
      setUploadError("Only Excel files (.xlsx or .xls) are allowed");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  // ================= FILE UPLOAD =================
  const handleFileUpload = async () => {
    if (!selectedFile) {
      setUploadError("Please select an Excel file first");
      return;
    }

    const token = localStorage.getItem("adminToken");
    if (!token) {
      setUploadError("Admin not logged in");
      return;
    }

    const formData = new FormData();
    formData.append("excelFile", selectedFile);

    try {
      setUploading(true);
      setUploadError("");
      setUploadMessage("");

      const res = await axios.post(
        "http://localhost:5000/api/admin/upload-voters",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUploadMessage(res.data.message || "Upload successful");
      setSelectedFile(null);
      fetchVoters();
    } catch (err) {
      setUploadError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ================= RENDER =================
  return (
    <div className="p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Voters List</h1>

      {/* ================= UPLOAD SECTION ================= */}
      <div className="mb-6 p-4 border rounded bg-gray-50">
        <h2 className="text-lg font-semibold mb-3">
          Upload Voters from Excel
        </h2>

        {/* FILE PICKER — SAFE FROM CSS BLOCKING */}
        <label className="inline-block cursor-pointer bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
          Choose Excel File
          <input
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files[0])}
          />
        </label>

        {selectedFile && (
          <p className="mt-2 text-sm text-gray-700">
            Selected file: <b>{selectedFile.name}</b>
          </p>
        )}

        <button
          type="button"
          onClick={handleFileUpload}
          disabled={uploading || !selectedFile}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload Voters"}
        </button>

        {uploadMessage && (
          <p className="text-green-600 mt-2">{uploadMessage}</p>
        )}

        {uploadError && (
          <p className="text-red-600 mt-2">{uploadError}</p>
        )}
      </div>

      {/* ================= VOTERS TABLE ================= */}
      {loading ? (
        <p className="text-gray-500">Loading voters...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-3 py-2">Name</th>
                <th className="border px-3 py-2">PIN</th>
                <th className="border px-3 py-2">Phone</th>
                <th className="border px-3 py-2">Has Voted</th>
              </tr>
            </thead>
            <tbody>
              {voters.map((v) => (
                <tr key={v._id} className="hover:bg-gray-100">
                  <td className="border px-3 py-2">
                    {v.name || v.fullName}
                  </td>
                  <td className="border px-3 py-2">{v.pin}</td>
                  <td className="border px-3 py-2">{v.phone}</td>
                  <td className="border px-3 py-2">
                    {v.hasVoted ? "Yes" : "No"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {voters.length === 0 && (
            <p className="text-gray-500 mt-4">No voters found.</p>
          )}
        </div>
      )}

      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}

export default VotersList;
