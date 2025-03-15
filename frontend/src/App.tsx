import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ErrorBoundary from "./components/ErrorBoundary";
import LandingPage from "./features/landing/pages/LandingPage";
import Auth from "./features/auth/pages/Auth";



const App: React.FC = () => (
  <div className="min-h-screen bg-gray-100">
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID_HERE">
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </ErrorBoundary>
    </Router>
    </GoogleOAuthProvider>
  </div>
);

export default App;