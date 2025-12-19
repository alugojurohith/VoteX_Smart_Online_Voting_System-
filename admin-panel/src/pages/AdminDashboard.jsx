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

  const adminToken = localStorage.getItem("adminToken");

  // =================================================
  // FETCH ALL CANDIDATES
  // =================================================
  const fetchCandidates = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/candidates/list"
      );

      const candidatesArray = Array.isArray(res.data)
        ? res.data
        : res.data?.candidates || [];

      const formatted = candidatesArray.map((c) => ({
        _id: c._id,
        fullName: c.fullName,
        party: c.party,
        votes: c.votes ?? 0,
        candidatePhoto: c.candidatePhoto
          ? `http://localhost:5000${c.candidatePhoto}`
          : null,
        partyLogo: c.partySymbol
          ? `http://localhost:5000${c.partySymbol}`
          : null,
      }));

      setCandidates(formatted);
    } catch (error) {
      console.error("FETCH CANDIDATES ERROR:", error);
      setCandidates([]);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  // =================================================
  // DELETE CANDIDATE (UI ONLY)
  // =================================================
  const deleteCandidate = (id) => {
    setCandidates((prev) => prev.filter((c) => c._id !== id));
  };

  // =================================================
  // VOTE (UI ONLY)
  // =================================================
  const incrementVote = (id) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c._id === id ? { ...c, votes: c.votes + 1 } : c
      )
    );
  };

  // =================================================
  // RENDER
  // =================================================
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar active={view} onNavigate={setView} />

      <main className="flex-1 p-8 overflow-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-600">
            Manage candidates, voters, and results
          </p>
        </header>

        <section className="bg-white rounded shadow p-6">
          {view === "list" && (
            <CandidatesList
              candidates={candidates}
              onDelete={deleteCandidate}
              onVote={incrementVote}
            />
          )}

          {view === "form" && (
            <AddCandidate
              adminToken={adminToken}
              onSuccess={() => {
                fetchCandidates();
                setView("list");
              }}
            />
          )}

          {view === "results" && (
            <VotingResults candidates={candidates} />
          )}

          {view === "voters" && <VotersList />}
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
