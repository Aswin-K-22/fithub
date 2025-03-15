import React from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import LandingPage from "./features/landing/pages/LandingPage";
import Login from "./features/auth/pages/Login";

const App: React.FC = () => {
  const showLogin = false; // Toggle to test—later use routing
  return (
    <div className="min-h-screen bg-gray-100">
      <ErrorBoundary>{showLogin ? <Login /> : <LandingPage />}</ErrorBoundary>
    </div>
  );
};

export default App;