import React, { JSX, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ErrorBoundary from "./components/ErrorBoundary";
import LandingPage from "./features/landing/pages/LandingPage";
import Auth from "./features/auth/pages/Auth";
import VerifyOtp from "./features/auth/pages/VerifyOtp";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "./lib/redux/slices/authSlice";
import { getMe, getTrainerMe } from "./lib/api/authApi";
import AdminDashboard from "./features/admin/pages/AdminDashboard";
import DashboardView from "./features/admin/pages/DashboardView";
import UserManagement from "./features/admin/pages/UserManagement";
import Reports from "./features/admin/pages/Reports";
import Trainers from "./features/admin/pages/TrainersManagement";
import Gyms from "./features/admin/pages/Gyms";
import TrainerDashboard from "./features/trainer/pages/TrainerDashboard";
import TrainerProfile from "./features/trainer/pages/TrainerProfile";
import { AppDispatch, RootState } from "./lib/redux/store";
import AdminLogin from "./features/admin/pages/AdminLogin";
import TrainerLogin from "./features/trainer/pages/TrainerLogin";
import AddTrainer from "./features/admin/pages/AddTrainer";
import UserProfile from "./features/user/pages/UserProfile";
import AddGymForm from "./features/admin/pages/AddGymForm";
import 'react-toastify/dist/ReactToastify.css';
import GymSearchPage from "./features/user/pages/GymSearchPage";
import MembershipPage from "./features/user/pages/MembershipPage";

const ProtectedRoute: React.FC<{ element: JSX.Element; allowedRoles: string[] }> = ({ element, allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = user?.role || "";

  useEffect(() => {
    if (!isAuthenticated && !location.pathname.includes("login") && location.pathname !== "/verify-otp") {
      if (location.pathname.startsWith("/admin")) {
        navigate("/admin/login", { replace: true, state: { from: location } });
      } else if (location.pathname.startsWith("/trainer")) {
        navigate("/trainer/login", { replace: true, state: { from: location } });
      } else if (location.pathname !== "/") { 
        navigate("/auth", { replace: true, state: { from: location } });
      }
    } else if (isAuthenticated && !allowedRoles.includes(userRole) ) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, userRole, location, navigate, allowedRoles]);

  return isAuthenticated && allowedRoles.includes(userRole) ? element : null;
};

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkSession = async () => {
      if (
        location.pathname.includes("login") ||
        location.pathname === "/verify-otp" ||
        location.pathname.includes("google/callback") ||
        location.pathname === "/" ||
        location.pathname === "/gyms"  ||
        location.pathname === "/membership"
      ) {
        console.log("Skipping session check - on auth page or landing page");
        return;
      }

      if (isAuthenticated && user) {
        const validRoutes: { [key: string]: string[] } = {
          admin: ["/admin"],
          trainer: ["/trainer"],
          user: ["/", "/profile"],
        };
        const isValidRoute = validRoutes[user.role]?.some((route) => location.pathname.startsWith(route));
        if (isValidRoute) {
          console.log("Session already valid, skipping API call");
          return;
        }
      }

      try {
        let userData;
        if (location.pathname.startsWith("/trainer")) {
          const { user } = await getTrainerMe();
          userData = { id: user.id, email: user.email, name: user.name, role: user.role || "trainer" };
        } else {
          const { user } = await getMe();
          userData = user;
        }
        console.log("Session check user:", userData);
        dispatch(login(userData));

        if (userData.role === "admin" && !location.pathname.startsWith("/admin")) {
          navigate("/admin/dashboard", { replace: true });
        } else if (userData.role === "trainer" && !location.pathname.startsWith("/trainer")) {
          navigate("/trainer/dashboard", { replace: true });
        } else if (userData.role === "user" && location.pathname !== "/" && location.pathname !== "/profile") {
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Session check failed:", error);
        dispatch(logout());
        if (location.pathname.startsWith("/trainer")) {
          navigate("/trainer/login", { replace: true });
        } else if (location.pathname.startsWith("/admin")) {
          navigate("/admin/login", { replace: true });
        } else if (location.pathname !== "/") { 
          navigate("/auth", { replace: true });
        }
      }
    };

    checkSession();
  }, [location.pathname, dispatch, navigate]);

  console.log("App render - isAuthenticated:", isAuthenticated, "user.role:", user?.role);

  return (
    <div className="min-h-screen bg-gray-100">
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/gyms" element={<GymSearchPage />} />
            <Route path="/membership" element={<MembershipPage />} />
            <Route path="/profile" element={<ProtectedRoute element={<UserProfile />} allowedRoles={["user"]} />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="auth/google/callback" element={<Auth />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/trainer/login" element={<TrainerLogin />} />
            <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={["admin"]} />}>
              <Route path="dashboard" element={<DashboardView />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="reports" element={<Reports />} />
              <Route path="trainers" element={<Trainers />} />
              <Route path="trainers/add" element={<AddTrainer />} />
              <Route path="gyms" element={<Gyms />} />
              <Route path="gym/add" element={<AddGymForm />} />
              <Route path="earnings" element={<div>Earnings Page</div>} />
              <Route path="subscriptions" element={<div>Subscriptions Page</div>} />
              <Route path="ai-training" element={<div>AI Training Page</div>} />
              <Route path="notifications" element={<div>Notifications Page</div>} />
              <Route path="support" element={<div>Support Page</div>} />
              <Route path="settings" element={<div>Settings Page</div>} />
            </Route>
            <Route path="/trainer">
              <Route path="dashboard" element={<ProtectedRoute element={<TrainerDashboard />} allowedRoles={["trainer"]} />} />
              <Route path="profile" element={<ProtectedRoute element={<TrainerProfile />} allowedRoles={["trainer"]} />} />
            </Route>
            <Route path="*" element={<LandingPage />} />
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