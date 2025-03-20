import React, { JSX, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ErrorBoundary from "./components/ErrorBoundary";
import LandingPage from "./features/landing/pages/LandingPage";
import Auth from "./features/auth/pages/Auth";
import VerifyOtp from "./features/auth/pages/VerifyOtp";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "./lib/redux/slices/authSlice";
import { getMe } from "./lib/api/authApi";
import AdminDashboard from "./features/admin/components/AdminDashboard";
import TrainerDashboard from "./features/trainer/components/TrainerDashboard";
import { AppDispatch, RootState } from "./lib/redux/store";
import AdminLogin from "./features/admin/pages/AdminLogin";
import TrainerLogin from "./features/trainer/pages/TrainerLogin";

const ProtectedRoute: React.FC<{ element: JSX.Element; allowedRoles: string[] }> = ({ element, allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const navigate = useNavigate(); 
  const userRole = user?.role || "";

  useEffect(() => {
    if (!isAuthenticated) {
      if (location.pathname.startsWith("/admin")) {
        navigate("/admin/login", { replace: true, state: { from: location } });
      } else if (location.pathname.startsWith("/trainer")) {
        navigate("/trainer/login", { replace: true, state: { from: location } });
      } else {
        navigate("/auth", { replace: true, state: { from: location } });
      }
    } else if (!allowedRoles.includes(userRole)) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, userRole, location, navigate, allowedRoles]);

  return isAuthenticated && allowedRoles.includes(userRole) ? element : null;
};

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { user } = await getMe();
        console.log("Session check user:", user);
        dispatch(login(user));
        if (user.role === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else if (user.role === "trainer") {
          navigate("/trainer/dashboard", { replace: true });
        }
      } catch (error) {
        console.error("Session check failed:", error);
        dispatch(logout());
      }
    };
    checkSession();
  }, [dispatch, navigate]);

  console.log("App render - isAuthenticated:", isAuthenticated, "user.role:", user?.role);

  return (
    <div className="min-h-screen bg-gray-100">
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="auth/google/callback" element={<Auth />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/trainer/login" element={<TrainerLogin />} />
            <Route
              path="/admin/dashboard"
              element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={["admin"]} />}
            />
            <Route
              path="/trainer/dashboard"
              element={<ProtectedRoute element={<TrainerDashboard />} allowedRoles={["trainer"]} />}
            />
            <Route path="*" element={<LandingPage />} /> {/* Fallback to LandingPage */}
          </Routes>
        </ErrorBoundary>
      </GoogleOAuthProvider>
    </div>
  );
};

const AppWithRouter: React.FC = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter;