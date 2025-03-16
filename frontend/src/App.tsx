import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ErrorBoundary from "./components/ErrorBoundary";
import LandingPage from "./features/landing/pages/LandingPage";
import Auth from "./features/auth/pages/Auth";
import VerifyOtp from "./features/auth/pages/VerifyOtp";


const App: React.FC = () => (
  <div className="min-h-screen bg-gray-100">
    <GoogleOAuthProvider clientId= {import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
        </Routes>
      </ErrorBoundary>
    </Router>
    </GoogleOAuthProvider>
  </div>
);

export default App;
