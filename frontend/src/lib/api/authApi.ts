import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export const login = async (email: string, password: string) => {
  const response = await apiClient.post("/auth/login", { email, password });
  return response.data;
};

export const signup = async (name: string, email: string, password: string) => {
  const response = await apiClient.post("/auth/signup", { name, email, password });
  return response.data; 
};

export const googleAuth = async (token: string) => {
  const response = await apiClient.post("/auth/google", { token });
  return response.data; 
};



export const verifyOtp = async (email: string, otp: string) => {
  const response = await apiClient.post("/auth/verify-otp", { email, otp });
  return response.data; 
};
export const resendOtp = async (email: string) => {
  const response = await apiClient.post("/auth/resend-otp", { email });
  return response.data;
};