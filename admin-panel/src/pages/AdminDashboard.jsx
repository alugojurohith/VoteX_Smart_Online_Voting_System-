import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/SideBar.jsx";
import CandidatesList from "./CandidatesList.jsx";
import AddCandidate from "./AddCandidate.jsx";
import VotingResults from "./VotingResults.jsx";
import VotersList from "./VoterList.jsx";

function AdminDashboard() {
  const [view, setView] = useState("list");
  const [candidates, setCandidates] = useState([]);

  // -----------------------------
  // ✔ FETCH ALL CANDIDATES
  // -----------------------------
  async function fetchCandidates() {
    try {
      const res = await axios.get("http://localhost:5000/api/candidates/list");
      console.log("Backend response:", res.data);

      // Ensure we have an array
      const candidatesArray = Array.isArray(res.data)
        ? res.data
        : res.data?.candidates || [];

      const formatted = candidatesArray.map((c) => ({
        _id: c._id,
        fullName: c.fullName,
        party: c.party,
        votes: c.votes ?? 0,
        candidatePhoto: `http://localhost:5000/${c.candidatePhoto}`,
        partyLogo: `http://localhost:5000/${c.partySymbol}`,
      }));

      setCandidates(formatted);
    } catch (error) {
      console.error("Error loading candidates:", error);
      setCandidates([]);
    }
  }

  useEffect(() => {
    fetchCandidates();
  }, []);

  // -----------------------------
  // ✔ ADD CANDIDATE FUNCTION
  // -----------------------------
  async function addCandidate(data) {
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("party", data.party);
    formData.append("candidatePhoto", data.candidatePhoto);
    formData.append("partyLogo", data.partyLogo); // Must match Multer field

    try {
      const res = await axios.post(
        "http://localhost:5000/api/candidates/add",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const saved = res.data.candidate;

      setCandidates((prev) => [
        ...prev,
        {
          _id: saved._id,
          fullName: saved.fullName,
          party: saved.party,
          votes: saved.votes ?? 0,
          candidatePhoto: `http://localhost:5000/${saved.candidatePhoto}`,
          partyLogo: `http://localhost:5000/${saved.partySymbol}`,
        },
      ]);

      alert("Candidate added successfully!");
      setView("list");
    } catch (err) {
      console.error("Error uploading candidate:", err);
      alert("Error uploading candidate!");
    }
  }

  // -----------------------------
  // ✔ DELETE CANDIDATE (UI only)
  // -----------------------------
  function deleteCandidate(id) {
    setCandidates((prev) => prev.filter((c) => c._id !== id));
  }

  // -----------------------------
  // ✔ VOTE (UI only)
  // -----------------------------
  function incrementVote(id) {
    setCandidates((prev) =>
      prev.map((c) => (c._id === id ? { ...c, votes: c.votes + 1 } : c))
    );
  }

  // -----------------------------
  // ✔ RENDER UI
  // -----------------------------
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar active={view} onNavigate={setView} className="w-64" />

      <main className="flex-1 p-8 overflow-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <p className="text-sm text-gray-600">Manage candidates and view results</p>
        </header>

        <section className="bg-white rounded shadow p-6">
          {view === "list" && (
            <CandidatesList
              candidates={candidates}
              onDelete={deleteCandidate}
              onVote={incrementVote}
            />
          )}

          {view === "form" && <AddCandidate onAdd={addCandidate} />}

          {view === "results" && <VotingResults candidates={candidates} />}

          {view === "voters" && <VotersList />} {/* ✅ Voters List added */}
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
