import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/HomePage.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import VoterLogin from "./pages/VoterLogin.jsx";
import AdminDashBoard from "./pages/AdminDashboard.jsx";
import OTPVerificationPage from "./pages/OTPVerificationPage.jsx";
import VotePage from "./pages/VotePage.jsx";

// Authentication Guard Components
const AdminProtectedRoute = ({ children }) => {
  const adminToken = localStorage.getItem("adminToken");
  return adminToken ? children : <Navigate to="/admin-login" replace />;
};

const VoterProtectedRoute = ({ children }) => {
  const voterToken = localStorage.getItem("voterToken");
  return voterToken ? children : <Navigate to="/voter-login" replace />;
};

const OTPRequiredRoute = ({ children }) => {
  const phone = localStorage.getItem("phone");
  return phone ? children : <Navigate to="/voter-login" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/voter-login" element={<VoterLogin />} />
      <Route
        path="/admin-dashboard"
        element={
          <AdminProtectedRoute>
            <AdminDashBoard />
          </AdminProtectedRoute>
        }
      />
      <Route path="/otp-verification" element={
        <OTPRequiredRoute>
          <OTPVerificationPage />
        </OTPRequiredRoute>
      } />
      <Route
        path="/vote-page"
        element={
          <VoterProtectedRoute>
            <VotePage />
          </VoterProtectedRoute>
        }
      />
    </Routes>
  );
}
export default App;
