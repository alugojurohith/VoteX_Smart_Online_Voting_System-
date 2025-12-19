import React, { useEffect, useState } from "react";
import axios from "axios";

function CandidatesList() {
  const [candidates, setCandidates] = useState([]);
  const BASE_URL = "http://localhost:5000";

  // ===============================
  // FETCH CANDIDATES
  // ===============================
  const fetchCandidates = async () => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      const res = await axios.get(`${BASE_URL}/api/candidates/list`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      setCandidates(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error loading candidates:", error);
    }
  };

  // ===============================
  // DELETE CANDIDATE
  // ===============================
  const deleteCandidate = async (id) => {
    if (!window.confirm("Are you sure you want to delete this candidate?")) {
      return;
    }

    try {
      const adminToken = localStorage.getItem("adminToken");
      await axios.delete(`${BASE_URL}/api/candidates/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      alert("Candidate deleted successfully!");
      fetchCandidates();
    } catch (error) {
      console.error("Error deleting candidate:", error);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  // ===============================
  // HELPER: BUILD IMAGE URL
  // ===============================
  const buildImageUrl = (path) => {
    if (!path) return "";
    return `${BASE_URL}${path}`; // 🔥 NO extra slash
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2
        style={{
          fontSize: "24px",
          color: "#000",
          marginBottom: "20px",
          fontWeight: "bold",
        }}
      >
        All Candidates
      </h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#ffffff",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <thead>
          <tr style={{ background: "#e8f0ff", textAlign: "center" }}>
            {["Photo", "Party Logo", "Full Name", "Party", "Action"].map(
              (h) => (
                <th
                  key={h}
                  style={{
                    padding: "12px",
                    color: "#000",
                    fontWeight: "600",
                    borderBottom: "2px solid #bcd2ff",
                  }}
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>

        <tbody>
          {candidates.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "#555",
                }}
              >
                No candidates found
              </td>
            </tr>
          ) : (
            candidates.map((c) => (
              <tr
                key={c._id}
                style={{
                  textAlign: "center",
                  borderBottom: "1px solid #dbe3ff",
                }}
              >
                {/* Candidate Photo */}
                <td style={{ padding: "10px" }}>
                  <img
                    src={buildImageUrl(c.candidatePhoto)}
                    alt="Candidate"
                    width="70"
                    height="70"
                    style={{
                      borderRadius: "8px",
                      objectFit: "cover",
                      border: "1px solid #ccc",
                    }}
                  />
                </td>

                {/* Party Logo */}
                <td style={{ padding: "10px" }}>
                  <img
                    src={buildImageUrl(c.partySymbol)}
                    alt="Party Symbol"
                    width="70"
                    height="70"
                    style={{
                      borderRadius: "8px",
                      objectFit: "contain",
                      border: "1px solid #ccc",
                      background: "white",
                    }}
                  />
                </td>

                {/* Full Name */}
                <td
                  style={{
                    padding: "10px",
                    fontSize: "16px",
                    color: "#000",
                  }}
                >
                  {c.fullName}
                </td>

                {/* Party */}
                <td style={{ padding: "10px", color: "#333" }}>
                  {c.party}
                </td>

                {/* Delete */}
                <td style={{ padding: "10px" }}>
                  <button
                    onClick={() => deleteCandidate(c._id)}
                    style={{
                      padding: "8px 14px",
                      background: "black",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CandidatesList;
