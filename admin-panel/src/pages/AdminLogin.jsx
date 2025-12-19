import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!username || !password) {
      setMessage("Please enter both username and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", {
        username,
        password,
      });

      if (res.data.success) {
        setMessage("Login successful!");
        localStorage.setItem("adminToken", res.data.token);
        navigate("/admin-dashboard");
      } else {
        setMessage(res.data.message || "Invalid credentials");
      }
    } catch (error) {
      setMessage(
        error?.response?.data?.message || "Login failed. Try again."
      );
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Admin Login
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {/* Username */}
          <input
            type="text"
            placeholder="Enter admin username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg transition ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:bg-indigo-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Feedback Message */}
        {message && (
          <p
            className={`text-center mt-4 font-medium ${
              message === "Login successful!"
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <p className="text-gray-500 text-sm mt-4 text-center">
          Enter your admin credentials to access the dashboard.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
