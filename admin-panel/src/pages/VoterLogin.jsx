import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function VoterLogin() {
  const navigate = useNavigate();
  const [voterId, setVoterId] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    // Basic validation
    if (!voterId.trim() || !phone.trim()) {
      setMessage("Please enter both Voter ID and Phone Number.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      setMessage("Phone number must be 10 digits.");
      return;
    }

    setLoading(true);

    try {
      const Phone = phone.trim();

      // store so OTP page can use it
      localStorage.setItem("phone", Phone);
      localStorage.setItem("voterId", voterId.trim());

      const res = await axios.post("http://localhost:5000/api/auth/send-otp", {
        phone: Phone,
        voterId,
      });

      console.log("send-otp response:", res.data);

      if (res.data?.otp) {
        // DEV ONLY
        localStorage.setItem("otp", res.data.otp);
        alert(`OTP (DEV MODE): ${res.data.otp}`);
      }

      setMessage(res.data.message || "OTP sent successfully");
      navigate("/otp-verification");
    } catch (error) {
      console.error("Error sending OTP:", error);
      const errMsg =
        error?.response?.data?.message || "Failed to send OTP. Try again.";
      setMessage(errMsg);
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Voter Login</h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Voter ID"
            value={voterId}
            onChange={(e) => setVoterId(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="tel"
            placeholder="Phone Number"
            maxLength={10}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Sending OTP..." : "Login"}
          </button>
        </form>

        {message && (
          <p className="text-center text-green-600 text-sm mt-3">{message}</p>
        )}

        <p className="text-gray-500 text-sm mt-4 text-center">
          Enter your Voter ID and Phone Number to vote.
        </p>
      </div>
    </div>
  );
}
export default VoterLogin;
