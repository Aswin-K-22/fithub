import axios from "axios";

// Main client with interceptor for most requests
const apiClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Separate client for refresh token without interceptor
const refreshClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to apiClient only
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log("originalRequest._retry", originalRequest._retry);

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await refreshClient.post("/auth/refresh-token"); // Use refreshClient here
        return apiClient(originalRequest); // Retry original request
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const login = async (email: string, password: string) => {
  const response = await apiClient.post("/auth/login", { email, password });
  return response.data;
};

export const signup = async (name: string, email: string, password: string) => {
  const response = await apiClient.post("/auth/signup", { name, email, password });
  return response.data;
};

export const googleAuth = async (code: string) => {
  const response = await apiClient.post("/auth/google", { code });
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

export const logout = async (email: string) => {
  const response = await apiClient.post("/auth/logout" ,{email});
  return response.data;
};

export const getMe = async () => {
  const response = await apiClient.get("/auth/user");
  return response.data;
};

export const refreshToken = async () => {
  const response = await refreshClient.post("/auth/refresh-token");
  return response.data;
};

export default apiClient;