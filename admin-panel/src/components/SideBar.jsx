import React from "react";
import { useNavigate } from "react-router-dom";

function Sidebar({ active = "list", onNavigate }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  const items = [
    { key: "list", label: "Candidates List", icon: "👥" },
    { key: "form", label: "Add Candidate", icon: "➕" },
    { key: "results", label: "Voting Results", icon: "📊" },
    { key: "voters", label: "Voters List", icon: "🗳️" },
  ];

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4 flex flex-col">
      <div className="mb-6">
        <h2 className="text-lg font-bold">Admin</h2>
        <p className="text-sm text-gray-500">Election Panel</p>
      </div>

      <nav className="flex-1 space-y-2">
        {items.map((it) => (
          <button
            key={it.key}
            onClick={() => onNavigate(it.key)}
            className={`w-full text-left px-3 py-2 rounded flex items-center gap-3 ${
              active === it.key
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="text-lg">{it.icon}</span>
            <span>{it.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-4 text-xs text-gray-500">
        <div>
          Logged in as <span className="font-medium">Admin</span>
        </div>
        <button
          onClick={handleLogout}
          className="mt-2 w-full px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
