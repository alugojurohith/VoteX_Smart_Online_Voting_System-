import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/HomePage.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import VoterLogin from "./pages/VoterLogin.jsx";
import AdminDashBoard from "./pages/AdminDashBoard.jsx";
import OTPVerificationPage from "./pages/OTPVerificationPage.jsx";
import VotePage from "./pages/VotePage.jsx";
function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/voter-login" element={<VoterLogin />} />
      <Route path="/admin-dashboard" element={<AdminDashBoard />} />
      <Route path="/otp-verification" element={<OTPVerificationPage/>} />
      <Route path="/vote-page" element={<VotePage />} />
    </Routes>
  );
}
export default App;
