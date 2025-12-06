import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function OTPVerificationPage() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const otpRequested = useRef(false);
useEffect(() => {
    async function init() {
      if (otpRequested.current) return;
      otpRequested.current = true;

      const phone = localStorage.getItem("phone");

      if (!phone) {
        alert("Phone not found. Please login first.");
        return navigate("/voter-login");
      }

      const storedOtp = localStorage.getItem("otp");
      if (storedOtp) {
        setOtp(storedOtp);
        alert(`Your OTP (dev): ${storedOtp}`);
        return;
      }

      try {
        const res = await axios.post(
          "http://localhost:5000/api/auth/send-otp",
          { phone }
        );

        if (res.data?.otp) {
          localStorage.setItem("otp", res.data.otp);
          setOtp(res.data.otp);
          alert(`Your OTP (dev): ${res.data.otp}`);
        } else {
          setMessage(res.data?.message || "OTP sent");
        }
      } catch (err) {
        console.error("Failed to send OTP:", err);
        setMessage("Failed to send OTP. Try again.");
      }
    }

    init();
}, []);  //  <-- FIXED


  const handleVerifyOTP = async () => {
    const phone = localStorage.getItem("phone");
    const inputOtp = otp.trim();

    if (!phone) {
      alert("Phone number not found. Please login first.");
      return navigate("/voter-login");
    }

    if (!/^\d{6}$/.test(inputOtp)) {
      alert("Enter a valid 6-digit OTP");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        { phone, otp: inputOtp }
      );

      if (res.data?.success) {
        if (res.data.voterId) {
          localStorage.setItem("voterId", res.data.voterId);
        }

        localStorage.removeItem("otp");

        alert("OTP verified successfully");
        navigate("/vote-page");
      } else {
        alert(res.data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("OTP verify error:", error);
      alert(error?.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-gray-200">
        <h1 className="text-2xl font-bold text-center mb-6">OTP Verification</h1>

        <p className="text-gray-600 text-sm text-center mb-4">
          Enter the 6-digit OTP sent to your phone.
        </p>

        {/* OTP Input */}
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength="6"
          placeholder="Enter OTP"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-center tracking-widest mb-4"
        />

        {/* Verify Button */}
        <button
          onClick={handleVerifyOTP}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Verify OTP
        </button>

        {message && (
          <p className="text-red-500 text-center mt-4">{message}</p>
        )}

        <p className="text-gray-500 text-xs text-center mt-4">
          Didn't receive the OTP? Try again in a few seconds.
        </p>
      </div>
    </div>
  );
}

export default OTPVerificationPage;
