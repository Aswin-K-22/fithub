import React, { useState, FormEvent, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { login } from "../../../lib/redux/slices/authSlice";
import { login as loginApi, signup as signupApi } from "../../../lib/api/authApi";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";


const Auth: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLogin, setIsLogin] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("type") !== "signup"; 
  });

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({ email: "", password: "", confirmPassword: "", name: "" });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setIsLogin(params.get("type") !== "signup");
  }, [location.search]);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); 
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateLogin = () => {
    let valid = true;
    const newErrors = { email: "", password: "", confirmPassword: "", name: "" };

    if (!loginData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(loginData.email)) {
      newErrors.email = "Email is invalid";
      valid = false;
    }
    if (!loginData.password || loginData.password.length < 6) {
      newErrors.password = "valid Password is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const validateSignup = () => {
    let valid = true;
    const newErrors = { email: "", password: "", confirmPassword: "", name: "" };

    if (!signupData.name) {
      newErrors.name = "Full name is required";
      valid = false;
    }
    if (!signupData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(signupData.email)) {
      newErrors.email = "Email is invalid";
      valid = false;
    }
    if (!signupData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (signupData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }
    if (signupData.password !== signupData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don’t match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateLogin()) {
        toast.error("Please fix form errors", { position: "top-right" });
        return;
      }

    try {
      const response = await loginApi(loginData.email, loginData.password);
      dispatch(login({ email: response.email, name: response.name }));
      toast.success("Login successful!", { position: "top-right" });
      navigate("/");
    } catch (error) {
        toast.error(error.response?.data?.message || "Login failed—check credentials", {
            position: "top-right",
          });
          console.error("Login failed:", error);
    }
  };

  const handleSignupSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateSignup()) {
        toast.error("Please fix form errors", { position: "top-right" });
        return;
      }

      try {
        const response = await signupApi(signupData.name, signupData.email, signupData.password);
        dispatch(login({ email: response.email, name: response.name })); // Auto-login
        toast.success("Signup successful!", { position: "top-right" });
        navigate("/");
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Signup failed—email may exist", {
          position: "top-right",
        });
        console.error("Signup failed:", error);
    }
  };


// Google Login/Signup
const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      const data = await response.json();
      dispatch(login({ email: data.email, name: data.name }));
      toast.success("Logged in with Google!", { position: "top-right" });
      navigate("/");
    } catch (error) {
      toast.error("Google auth failed", { position: "top-right" });
      console.error("Google auth failed:", error);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google login failed", { position: "top-right" });
  };


  return (
    <div className="font-inter bg-gray-50">
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-gray-900 p-6 pt-16">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300">
          <div className="flex items-center justify-center p-6 border-b border-gray-200">
            <img
              src="https://ai-public.creatie.ai/gen_page/logo_placeholder.png"
              alt="FitHub"
              className="h-8"
            />
          </div>
          <div className="p-8">
            {/* toggle Buttons */}
            <div className="flex justify-center space-x-4 mb-6">
              <button
                className={`px-6 py-2 font-medium transition-all duration-300 ${
                  isLogin
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-blue-600 hover:border-b-2 hover:border-blue-600"
                }`}
                onClick={() => navigate("/auth?type=login")}
              >
                Login
              </button>
              <button
                className={`px-6 py-2 font-medium transition-all duration-300 ${
                  !isLogin
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-blue-600 hover:border-b-2 hover:border-blue-600"
                }`}
                onClick={() => navigate("/auth?type=signup")}
              >
                Sign Up
              </button>
            </div>

            {/* login Form */}
            {isLogin ? (
              <form className="space-y-6" onSubmit={handleLoginSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your password"
                    />
                    <div className="absolute right-3 top-3 text-gray-400">
                      <i className="fas fa-eye"></i>
                    </div>
                  </div>
                  <div className="h-1 w-full bg-gray-200 mt-2 rounded">
                    <div className="h-1 bg-green-500 rounded" style={{ width: "70%" }}></div>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <a
                    href="#"
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:scale-[1.02] transition-all duration-200"
                >
                  Login
                </button>
              </form>
            ) : (
              /* Signup Form */
              <form className="space-y-6" onSubmit={handleSignupSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={signupData.name}
                    onChange={handleSignupChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={signupData.email}
                    onChange={handleSignupChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="password"
                      value={signupData.password}
                      onChange={handleSignupChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Create password"
                    />
                    <div className="absolute right-3 top-3 text-gray-400">
                      <i className="fas fa-eye"></i>
                    </div>
                  </div>
                  <div className="h-1 w-full bg-gray-200 mt-2 rounded">
                    <div className="h-1 bg-green-500 rounded" style={{ width: "70%" }}></div>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={signupData.confirmPassword}
                    onChange={handleSignupChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Confirm password"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:scale-[1.02] transition-all duration-200"
                >
                  Sign Up
                </button>
              </form>
            )}

            {/* Social Buttons */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-3 flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  text="continue_with" 
                  width="300" 
                />
              </div>
              <button className="flex items-center justify-center py-3 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-600 transition-all duration-200">
                <i className="fab fa-facebook-f text-xl"></i>
              </button>
              <button className="flex items-center justify-center py-3 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-600 transition-all duration-200">
                <i className="fab fa-apple text-xl"></i>
              </button>
            </div>
            <div className="mt-6">
              <button className="w-full py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transform hover:scale-[1.02] transition-all duration-200">
                Try AI Trainer as Guest
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Auth;