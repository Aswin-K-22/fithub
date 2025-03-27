import React, { useState, useEffect, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { login } from "../../../lib/redux/slices/authSlice";
import { verifyOtp, resendOtp, trainerLoginVerifyOtp, resendTrainerOtp } from "../../../lib/api/authApi";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import OtpInput from "react-otp-input";

const VerifyOtp: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { email, purpose = "signup" } = location.state || {};
  console.log("Received state:", { email, purpose });

  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [errors, setErrors] = useState({ otp: "" });

  useEffect(() => {
    if (!email) {
      toast.error("No email provided—please try again");
      navigate(purpose === "trainer-login" ? "/trainer/login" : "/auth?type=signup");
    }
    console.log("Received state in useEffect:", { email, purpose });
  }, [email, navigate, purpose]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const handleOtpSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setErrors({ otp: "Enter a valid 6-digit OTP" });
      toast.error("Please enter a valid OTP");
      return;
    }
  
    console.log("Submitting OTP with purpose:", purpose);
    try {
      if (purpose === "signup") {
        console.log("Calling verifyOtp for signup");
        const { user } = await verifyOtp(email, otp);
        console.log("Signup user:", user);
        dispatch(login(user));
        toast.success("Verification successful!");
        navigate("/");
      } else if (purpose === "trainer-login") {
        console.log("Calling trainerLoginVerifyOtp");
        const { user } = await trainerLoginVerifyOtp(email, otp); // Match backend response
        console.log("Trainer data:", user);
        if (user.role !== "trainer") {
          throw new Error("You are not authorized as a trainer");
        }
        dispatch(login(user));
        console.log("Dispatched login for trainer");
        toast.success("Trainer login successful!");
        navigate("/trainer/dashboard", { replace: true }); // Use replace to avoid history stack issues
        console.log("Navigating to /trainer/dashboard");
      } else {
        console.log("Fallback case");
        toast.success("OTP verified successfully!");
        navigate("/");
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error("OTP submission error:", axiosError);
      toast.error(axiosError.response?.data?.message || "OTP verification failed");
    }
  };

  const handleResendOtp = async () => {
    try {
      if (purpose === "trainer-login") {
        await resendTrainerOtp(email);
        toast.success("OTP resent to your email!");
      } else {
        await resendOtp(email);
        toast.success("OTP resent to your email!");
      }
      setTimeLeft(30);
      setCanResend(false);
      setOtp("");
      setErrors({ otp: "" });
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      toast.error(axiosError.response?.data?.message || "Failed to resend OTP");
      console.error("Resend OTP failed:", axiosError);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
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
            <form className="space-y-6" onSubmit={handleOtpSubmit}>
              <div className="text-center">
                <h1 className="mb-2 text-2xl font-bold text-gray-900">
                  {purpose === "trainer-login" ? "Trainer Login - Verify OTP" : "Verify Your OTP"}
                </h1>
                <p className="mb-8 text-sm text-gray-600">
                  Enter the 6-digit OTP sent to {email}
                </p>
              </div>
              <div className="flex justify-between gap-2">
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  renderInput={(props, index) => (
                    <input
                      {...props}
                      className={`w-12 h-12 min-w-0 text-center text-xl font-semibold border border-gray-300 rounded-md focus:border-blue-600 focus:ring-1 focus:ring-blue-600 ${
                        index < 5 ? "mr-2" : ""
                      }`}
                      style={{ width: "48px" }}
                    />
                  )}
                  containerStyle="flex justify-between w-full"
                />
              </div>
              {errors.otp && <p className="text-red-500 text-sm mt-1 text-center">{errors.otp}</p>}
              <div className="mb-6 text-center text-sm text-gray-500">
                <span>OTP expires in </span>
                <span className="font-semibold text-blue-600">{formatTime(timeLeft)}</span>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Verify & {purpose === "trainer-login" ? "Login" : "Continue"}
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={!canResend}
                className="w-full py-3 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                Resend OTP {canResend ? "" : `(${formatTime(timeLeft)})`}
              </button>
              <div className="flex flex-col gap-3 text-center text-sm">
                <button
                  onClick={() => navigate(purpose === "trainer-login" ? "/trainer/login" : "/auth?type=signup")}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Change Email
                </button>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Having trouble? Contact Support
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VerifyOtp;