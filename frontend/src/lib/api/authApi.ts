/* eslint-disable no-useless-catch */
import axios from "axios";
import { AddTrainerData } from "../../entities/AddTrainerData";

const apiClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await refreshClient.post("/auth/refresh-token");
        console.log("Token refreshed successfully:", refreshResponse.data);
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Clear cookies or local state if refresh fails completely
        document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// User Authentication
export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post("/auth/login", { email, password });
    return response.data; // Expected: { user: {...} }
  } catch (error) {
    throw error; // Let caller handle specific errors
  }
};

export const signup = async (name: string, email: string, password: string) => {
  try {
    const response = await apiClient.post("/auth/signup", { name, email, password });
    return response.data; // Expected: success message or user data
  } catch (error) {
    throw error;
  }
};

export const googleAuth = async (code: string) => {
  try {
    const response = await apiClient.post("/auth/google", { code });
    return response.data; // Expected: { user: {...} }
  } catch (error) {
    throw error;
  }
};

export const verifyOtp = async (email: string, otp: string) => {
  try {
    const response = await apiClient.post("/auth/verify-otp", { email, otp });
    return response.data; // Expected: { user: {...} }
  } catch (error) {
    throw error;
  }
};

export const resendOtp = async (email: string) => {
  try {
    const response = await apiClient.post("/auth/resend-otp", { email });
    return response.data; // Expected: success message
  } catch (error) {
    throw error;
  }
};

export const logout = async (email: string) => {
  try {
    const response = await apiClient.post("/auth/logout", { email });
    return response.data; // Expected: success message
  } catch (error) {
    throw error;
  }
};

export const getMe = async () => {
  try {
    const response = await apiClient.get("/auth/user");
    return { user: response.data.user }; // Normalize to { user: {...} }
  } catch (error) {
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const response = await refreshClient.post("/auth/refresh-token");
    return response.data; // Expected: new tokens
  } catch (error) {
    throw error;
  }
};

// Admin
export const adminLogin = async (email: string, password: string) => {
  try {
    console.log("Admin trying to login with email and password", email, password);
    const response = await apiClient.post("/auth/admin/login", { email, password });
    return response.data; // Expected: { user: {...} }
  } catch (error) {
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await apiClient.get("/admin/users");
    return response.data; // Expected: array of users
  } catch (error) {
    throw error;
  }
};

export const addTrainer = async (data: AddTrainerData) => {
  try {
    const response = await apiClient.post("/admin/addTrainer", data);
    return response.data; // Expected: trainer data or success message
  } catch (error) {
    throw error;
  }
};

// Trainer
export const trainerLogin = async (email: string, password: string) => {
  try {
    const response = await apiClient.post("/auth/trainer/login", { email, password });
    return response.data; // Expected: { user: {...} }
  } catch (error) {
    throw error;
  }
};

export const trainerLoginVerifyOtp = async (email: string, otp: string) => {
  try {
    const response = await apiClient.post("/auth/trainer/verify-otp", { email, otp });
    return { user: response.data.user }; // Normalize to { user: {...} }
  } catch (error) {
    throw error;
  }
};

export const getTrainerMe = async () => {
  try {
    const response = await apiClient.get("/auth/user-trainer", { withCredentials: true });
    console.log("Trainer data:", response.data);
    return { user: response.data.trainer }; // Normalize to { user: {...} }
  } catch (error) {
    throw error;
  }
};

export default apiClient;