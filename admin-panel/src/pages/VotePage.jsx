import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:5000";

function VotePage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [voterId, setVoterId] = useState(
    localStorage.getItem("voterId") || null
  );
  const [hasVoted, setHasVoted] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Check authentication on component mount
  useEffect(() => {
    const voterToken = localStorage.getItem("voterToken");
    if (!voterToken) {
      navigate("/voter-login");
      return;
    }
  }, [navigate]);

  // =============================
  // LOAD CANDIDATES
  // =============================
  useEffect(() => {
    async function loadCandidates() {
      try {
        const voterToken = localStorage.getItem("voterToken");
        const res = await axios.get(`${BASE_URL}/api/candidates/list`, {
          headers: {
            Authorization: `Bearer ${voterToken}`,
          },
        });
        const formatted = res.data.map((c) => ({
          _id: c._id,
          fullName: c.fullName,
          party: c.party,
          votes: Number(c.votes || 0),
          candidatePhoto: `${BASE_URL}${c.candidatePhoto}`, // ✅ FIXED
          partyLogo: `${BASE_URL}${c.partySymbol}`,         // ✅ FIXED
        }));
        setCandidates(formatted);
      } catch (err) {
        console.error("Failed to load candidates:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCandidates();
  }, []);

  // =============================
  // SEND OTP
  // =============================
  const sendOtp = async () => {
    if (!phone) return alert("Enter your phone number first");
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/send-otp`, { phone });
      if (res.data.success) {
        setOtpSent(true);
        alert("OTP sent successfully!");
      } else {
        alert(res.data.message || "Failed to send OTP");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    }
  };

  // =============================
  // VERIFY OTP
  // =============================
  const verifyOtp = async () => {
    if (!otp) return alert("Enter OTP");
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/verify-otp`, {
        phone,
        otp,
      });
      if (res.data.success) {
        localStorage.setItem("voterId", res.data.voterId);
        setVoterId(res.data.voterId);
        setHasVoted(res.data.hasVoted);
        alert("OTP verified successfully!");
      } else {
        alert(res.data.message || "Invalid OTP");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to verify OTP");
    }
  };

  // =============================
  // CHECK VOTER STATUS
  // =============================
  const checkVoterStatus = async () => {
    if (!voterId) return false;
    try {
      const voterToken = localStorage.getItem("voterToken");
      const res = await axios.get(
        `${BASE_URL}/api/auth/status/${voterId}`,
        {
          headers: {
            Authorization: `Bearer ${voterToken}`,
          },
        }
      );
      if (res.data.hasVoted) {
        setHasVoted(true);
        alert("You have already voted.");
        navigate("/");
        return false;
      }
      return true;
    } catch (err) {
      alert("Unable to verify voter. Please try again.");
      return false;
    }
  };

  // =============================
  // SUBMIT VOTE
  // =============================
  const handleVote = async (candidateId) => {
    const canVote = await checkVoterStatus();
    if (!canVote) return;

    try {
      const voterToken = localStorage.getItem("voterToken");
      await axios.post(
        `${BASE_URL}/api/candidates/vote/${candidateId}`,
        { voterId },
        {
          headers: {
            Authorization: `Bearer ${voterToken}`,
          },
        }
      );
      setHasVoted(true);
      alert("Vote submitted successfully!");

      // Clear voter data after successful voting
      setTimeout(() => {
        localStorage.removeItem("voterToken");
        localStorage.removeItem("voterId");
        localStorage.removeItem("phone");
        localStorage.removeItem("otp");
        navigate("/");
      }, 2000);
    } catch (err) {
      alert(err.response?.data?.message || "Voting failed");
    }
  };

  // =============================
  // LOADING
  // =============================
  if (loading) {
    return <p className="text-center p-6">Loading candidates...</p>;
  }

  // =============================
  // OTP PAGE
  // =============================
  if (!voterId) {
    return (
      <div className="p-6 max-w-md mx-auto bg-white rounded shadow space-y-4">
        <h1 className="text-2xl font-bold">Voter Verification</h1>

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-2 border rounded"
        />

        {otpSent && (
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-2 border rounded"
          />
        )}

        {!otpSent ? (
          <button
            onClick={sendOtp}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Send OTP
          </button>
        ) : (
          <button
            onClick={verifyOtp}
            className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Verify OTP
          </button>
        )}
      </div>
    );
  }

  // =============================
  // VOTING PAGE
  // =============================
  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-2">Vote for a Candidate</h1>
      <p className="text-sm text-gray-600 mb-6">
        Select your preferred candidate below
      </p>

      {candidates.length === 0 ? (
        <p className="text-gray-500">No candidates available.</p>
      ) : (
        <div className="space-y-4">
          {candidates.map((c) => (
            <div
              key={c._id}
              className="flex items-center justify-between bg-gray-50 p-4 rounded border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <img
                  src={c.candidatePhoto}
                  alt={c.fullName}
                  className="w-16 h-16 object-cover rounded"
                />
                <img
                  src={c.partyLogo}
                  alt={c.party}
                  className="w-12 h-12 object-contain rounded"
                />
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {c.fullName}
                  </p>
                  <p className="text-sm text-gray-600">{c.party}</p>
                </div>
              </div>

              <button
                onClick={() => handleVote(c._id)}
                disabled={hasVoted}
                className={`px-4 py-2 rounded font-semibold transition-all ${
                  hasVoted
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {hasVoted ? "✓ Voted" : "Vote"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VotePage;