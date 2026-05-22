import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AppProvider } from './context/AppContext';
import ProtectedRoute from "./components/RouteGuards";

import LandingPage from './pages/LandingPage';

import AuthLayout from './layouts/AuthLayout';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import OtpVerification from './pages/auth/OtpVerification';

import DashboardLayout from './layouts/DashboardLayout';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import ResumeAnalyzer from './pages/dashboard/ResumeAnalyzer';
import MockInterview from './pages/dashboard/MockInterview';
import CodingInterview from './pages/dashboard/CodingInterview';
import HrInterview from './pages/dashboard/HrInterview';
import PanicMode from './pages/dashboard/PanicMode';
import Analytics from './pages/dashboard/Analytics';
import Profile from './pages/dashboard/Profile';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>

          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<OtpVerification />} />
          </Route>

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="resume" element={<ResumeAnalyzer />} />
            <Route path="mock" element={<MockInterview />} />
            <Route path="coding" element={<CodingInterview />} />
            <Route path="hr" element={<HrInterview />} />
            <Route path="panic" element={<PanicMode />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="profile" element={<Profile />} />
            <Route
              path="*"
              element={<div className="p-4 text-secondary">Coming Soon…</div>}
            />
          </Route>

          {/* Catch All */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;