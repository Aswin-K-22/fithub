import React, { useState, FormEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../../../lib/redux/store";
import { login } from "../../../lib/redux/slices/authSlice";
import { trainerLogin as trainerLoginApi } from "../../../lib/api/authApi"; // Use trainerLogin
import { toast } from "react-toastify";
import { AxiosError } from "axios";

const TrainerLogin: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
  
    // Redirect if already authenticated as trainer
    useEffect(() => {
      if (isAuthenticated && user?.role === "trainer") {
        navigate("/trainer/dashboard");
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
  
      // Email validation: must be non-empty and end with @trainer.fithub.com
      if (!loginData.email) {
        newErrors.email = "Email is required";
        valid = false;
      } else if (!/^[a-zA-Z0-9._%+-]+@trainer\.fithub\.com$/.test(loginData.email)) {
        newErrors.email = "Email must be a valid trainer email (e.g., name@trainer.fithub.com)";
        valid = false;
      }
  
      // Password validation: min 8 chars, at least 1 letter, 1 number
      if (!loginData.password) {
        newErrors.password = "Password is required";
        valid = false;
      } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(loginData.password)) {
        newErrors.password = "Password must be at least 8 characters with 1 letter and 1 number";
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
        const { user } = await trainerLoginApi(loginData.email, loginData.password); // Use trainerLogin
        if (user.role !== "trainer") {
          throw new Error("You are not authorized as a trainer");
        }
        console.log("Trainer login response:", user);
        dispatch(login(user));
        toast.success("Login successful!", { position: "top-right" });
        navigate("/trainer/dashboard");
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
    <div className="min-h-screen bg-gray-50 font-[Inter] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-8xl">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center">
            <img
              src="https://ai-public.creatie.ai/gen_page/logo_placeholder.png"
              alt="FitHub Logo"
              className="h-12"
            />
            <span className="ml-3 text-2xl font-bold text-gray-900">FitHub</span>
          </Link>
        </div>

        <div className="flex flex-col items-center">
          <h2 className="mb-2 text-3xl font-bold text-center text-gray-900">Welcome back, trainer!</h2>
          <p className="mb-8 text-gray-600">Sign in to access your dashboard</p>

          <div className="w-full max-w-4xl overflow-hidden bg-white rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row">
              <div className="relative hidden w-1/2 md:block">
                <img
                  src="https://creatie.ai/ai/api/search-image?query=A%203D%20vector-style%20image%20with%20a%20clean,%20solid%20background%20color%20that%20contrasts%20significantly%20with%20the%20main%20theme.%20The%20content%20includes%20a%20professional%20fitness%20trainer%20in%20modern%20sportswear%20guiding%20a%20client%20through%20an%20exercise,%20rendered%20in%20a%20minimalist%20style%20with%20emphasis%20on%20form%20and%20movement&width=600&height=600&orientation=squarish&removebg=true&flag=4fda6bff-00ba-4700-9dc7-e24c3813ddcc"
                  alt="Trainer illustration"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="w-full p-8 md:w-1/2">
                {error && (
                  <div className="mb-4 p-4 rounded-md bg-red-50 border border-red-200">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <i className="fas fa-exclamation-circle text-red-400"></i>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    <div className="relative mt-1">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                        <i className="fas fa-envelope"></i>
                      </span>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full py-2 pl-10 border border-gray-300 rounded-md focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm placeholder-gray-400"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative mt-1">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                        <i className="fas fa-lock"></i>
                      </span>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full py-2 pl-10 border border-gray-300 rounded-md focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm placeholder-gray-400"
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="remember-me"
                        name="remember-me"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 border border-gray-300 rounded-md text-indigo-600 focus:ring-indigo-600"
                      />
                      <label htmlFor="remember-me" className="block ml-2 text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>
                    <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                      Forgot password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex justify-center w-full px-4 py-3 text-sm font-medium text-white transition duration-150 ease-in-out bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </button>

                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      <i className="fas fa-shield-alt text-indigo-600"></i> Secured by FitHub authentication
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Need help? Contact FitHub Admin at{" "}
              <a href="mailto:support@fithub.com" className="text-indigo-600 hover:text-indigo-500">
                support@fithub.com
              </a>
            </p>
          </div>
        </div>
      </div>

      <footer className="fixed bottom-0 w-full py-4 bg-white">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-sm text-gray-600">© 2024 FitHub. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-600 hover:text-indigo-600">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-indigo-600">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-indigo-600">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TrainerLogin;