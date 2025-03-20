import React, { useState, FormEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../../../lib/redux/store";
import { login } from "../../../lib/redux/slices/authSlice";
import { adminLogin as adminLoginApi } from "../../../lib/api/authApi"; 
import { toast } from "react-toastify";
import { AxiosError } from "axios";

const AdminLogin: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
  
    useEffect(() => {
      if (isAuthenticated && user?.role === "admin") {
        navigate("/admin/dashboard"); 
      }
    }, [isAuthenticated, user, navigate]);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setLoginData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    };
  
    const validateLogin = () => {
      let valid = true;
      const newErrors = { email: "", password: "" };
  
      if (!loginData.email) {
        newErrors.email = "Email is required";
        valid = false;
      } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(loginData.email)) {
        newErrors.email = "Email is invalid";
        valid = false;
      }
      if (!loginData.password || loginData.password.length < 6) {
        newErrors.password = "Valid Password is required";
        valid = false;
      }
  
      setErrors(newErrors);
      return valid;
    };
  
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!validateLogin()) {
        toast.error("Please fix form errors", { position: "top-right" });
        return;
      }
  
      setLoading(true);
      try {
        const { user } = await adminLoginApi(loginData.email, loginData.password); 
        console.log("Admin login response:", user);
        dispatch(login(user));
        toast.success("Login successful!", { position: "top-right" });
        navigate("/admin/dashboard");
      } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        toast.error(
          axiosError.response?.data?.message || "Login failed—check credentials",
          { position: "top-right" }
        );
        console.error("Login failed:", axiosError);
      } finally {
        setLoading(false);
      }
    };
  
    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white font-[Inter]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-10 w-auto"
          src="https://ai-public.creatie.ai/gen_page/logo_placeholder.png"
          alt="FitHub"
        />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Admin Login
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-envelope text-gray-400"></i>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={loginData.email}
                  onChange={handleChange}
                  className="block w-full py-2 pl-10 border border-gray-300 rounded-md focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm placeholder-gray-400"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-lock text-gray-400"></i>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={loginData.password}
                  onChange={handleChange}
                  className="block w-full py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm placeholder-gray-400"
                  placeholder="Enter your password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-end">
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <footer className="mt-8 text-center">
        <p className="text-sm text-gray-500">© 2024 FitHub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AdminLogin;