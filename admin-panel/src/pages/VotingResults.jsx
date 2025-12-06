import React, { useEffect, useState } from "react";
import axios from "axios";

function ResultBar({ percent }) {
  return (
    <div className="w-full bg-black/10 rounded-full h-2 overflow-hidden">
      <div
        style={{ width: `${percent}%` }}
        className="h-2 bg-blue-600 rounded-full transition-all duration-700"
      ></div>
    </div>
  );
}

function VotingResults() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get("http://localhost:5000/api/candidates/list");
        setCandidates(res.data);
      } catch (err) {
        console.error("Failed to fetch candidates:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalVotes = candidates.reduce((sum, c) => sum + (c.votes || 0), 0);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center text-black text-lg animate-pulse">
          Loading election data...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">

      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 space-y-8 border border-black/10">

        {/* Title */}
        <h2 className="text-4xl font-extrabold text-center text-black tracking-tight">
          Election Dashboard
        </h2>

        {/* Highlighted Winner */}
        {totalVotes > 0 && (
          <div className="p-4 rounded-xl bg-blue-100 border border-blue-300 shadow-md">
            <p className="text-sm font-semibold text-black flex items-center gap-2">
              🏆 Leading Candidate:
              <span className="font-bold text-blue-700">
                {[...candidates].sort((a, b) => b.votes - a.votes)[0].fullName}
              </span>
            </p>
          </div>
        )}

        {/* Results List */}
        <div className="space-y-5">
          {candidates.map((c) => {
            const votes = c.votes || 0;
            const percent =
              totalVotes === 0 ? 0 : ((votes / totalVotes) * 100).toFixed(1);

            return (
              <div
                key={c._id}
                className="p-5 rounded-2xl bg-white border border-black/10 shadow-md hover:shadow-xl transition-all duration-300"
              >

                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={`http://localhost:5000/${c.candidatePhoto}`}
                      alt="candidate"
                      className="w-14 h-14 rounded-full object-cover border border-black/20 shadow-sm"
                      onError={(e) => (e.target.src = "/default-user.png")}
                    />

                    <div>
                      <h3 className="text-base font-bold text-black">
                        {c.fullName}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <img
                          src={`http://localhost:5000/${c.partySymbol}`}
                          alt="party logo"
                          className="w-6 h-6 object-contain"
                          onError={(e) => (e.target.src = "/default-logo.png")}
                        />
                        <span className="text-xs px-3 py-1 bg-black/10 text-black rounded-full">
                          {c.party}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs font-semibold text-black bg-blue-100 px-3 py-1 rounded-full border border-blue-300 shadow-sm">
                    {votes} votes
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-4">
                  <ResultBar percent={percent} />
                  <p className="text-right text-[11px] text-black/60 mt-1">
                    {percent}% of total votes
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Summary */}
        <div className="mt-6 text-center p-4 bg-blue-50 border border-blue-300 rounded-xl shadow-sm">
          <p className="text-sm font-bold text-black">
            Total Votes Cast:{" "}
            <span className="text-blue-700">{totalVotes}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default VotingResults;