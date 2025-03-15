import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import LandingPage from "./features/landing/pages/LandingPage";
import Login from "./features/auth/pages/Login";



const App: React.FC = () => (
  <div className="min-h-screen bg-gray-100">
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  </div>
);

export default App;