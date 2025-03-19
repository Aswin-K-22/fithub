import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ErrorBoundary from "./components/ErrorBoundary";
import LandingPage from "./features/landing/pages/LandingPage";
import Auth from "./features/auth/pages/Auth";
import VerifyOtp from "./features/auth/pages/VerifyOtp";

import { useEffect } from "react";
import { useDispatch  } from "react-redux";
import { login ,logout as logoutAction} from "./lib/redux/slices/authSlice";
import { getMe } from "./lib/api/authApi";



const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { user } = await getMe(); 
        dispatch(login(user));
      } catch (error) {
        console.error("Session check failed:", error);
        dispatch(logoutAction());
      }
    };
    checkSession();
  }, [dispatch]);


return(

  <div className="min-h-screen bg-gray-100">
    <GoogleOAuthProvider clientId= {import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="auth/google/callback" element={<Auth/>}/>
          
        </Routes>
      </ErrorBoundary>
    </Router>
    </GoogleOAuthProvider>
  </div>

)};

export default App;
