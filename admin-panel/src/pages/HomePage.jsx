import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <header className="flex flex-col justify-center items-center text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-24 px-4">
        <h1 className="text-5xl font-bold mb-6">Online Voting System</h1>
        <p className="max-w-xl text-lg mb-8">
          Secure, fast, and transparent online voting platform for elections.
          Participate from anywhere, anytime.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={() => navigate("/voter-login")}
            className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-100 transition"
          >
            User Login
          </button>
          <button
            onClick={() => navigate("/admin-login")}
            className="bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-800 transition"
          >
            Admin Login
          </button>
        </div>
      </header>

      {/* About Section */}
      <section className="flex flex-col items-center text-center py-20 px-4 bg-white">
        <h2 className="text-3xl font-bold mb-6">About This System</h2>
        <p className="max-w-2xl text-gray-700 text-lg">
          This Online Voting System is designed to provide a secure and
          transparent platform for conducting elections. It ensures privacy,
          verifiability, and easy access for both voters and administrators.
          Our system leverages modern web technologies to make voting simple
          and trustworthy.
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 text-center">
        &copy; {new Date().getFullYear()} Online Voting System. All rights
        reserved.
      </footer>
    </div>
  );
};

export default HomePage;
