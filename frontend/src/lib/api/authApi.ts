/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-catch */
import axios from "axios";
import { AddTrainerData } from "../../entities/AddTrainerData";
import { TrainerProfileData } from "../../entities/Trainer";

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
    return { user: response.data.user }; 
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await apiClient.get("/auth/user/profile");
    return response.data;
  } catch (error) {
    console.error("Get user profile error:", error);
    throw error;
  }
};

export const updateUserProfile = async (data: { name?: string; profilePic?: File }) => {
  try {
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.profilePic) formData.append("profilePic", data.profilePic);

    const response = await apiClient.put("/auth/user/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Update user profile error:", error);
    throw error;
  }
};

export const fetchGyms = async (
  page: number,
  limit: number,
  filters: { search?: string; location?: string; gymType?: string; rating?: string }
) => {
  try {
    const response = await apiClient.get("/user/gyms", {
      params: {
        page,
        limit,
        search: filters.search,
        location: filters.location,
        gymType: filters.gymType,
        rating: filters.rating,
      },
    });
    return response.data; // Expected: { success: true, gyms: [...], page, totalPages, totalGyms }
  } catch (error) {
    console.error("Error fetching gyms:", error);
    throw error; // Let the caller (GymSearchPage) handle the error
  }
};


export const forgotPassword = async (email: string) => {
  try {
    const response = await apiClient.post("/auth/forgot-password", { email });
    return response.data;
  } catch (error) {
    console.error("Forgot password error:", error);
    throw error;
  }
};

export const resetPassword = async (email: string, otp: string, newPassword: string) => {
  try {
    const response = await apiClient.post("/auth/reset-password", { email, otp, newPassword });
    return response.data;
  } catch (error) {
    console.error("Reset password error:", error);
    throw error;
  }
};


export const verifyForgotPasswordOtp = async (email: string, otp: string) => {
  try {
    const response = await apiClient.post("/auth/verify-forgot-password-otp", { email, otp });
    return response.data;
  } catch (error) {
    console.error("Verify forgot password OTP error:", error);
    throw error;
  }
};


////////////////////////////////////////////////////////////////////////////
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

export const getUsers = async (page: number = 1, limit: number = 3) => {
  try {
    const response = await apiClient.get("/admin/users", {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
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

export const addGym = async (data: FormData) => {
  try {
    const response = await apiClient.post("/admin/addGym", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw error; 
  }
};


export const availbleTrainers = async () => {
  try {
    const response = await apiClient.get("/admin/available-trainers");
    console.log( ' response.data' ,response.data );
    
    return response.data;
  } catch (error) {
    console.error("Error fetching trainers:", error);
  }
  
} 

export const gymsList = async (page:number , limit :number) => {
  try {
    const response = await apiClient.get(`/admin/gyms?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching gyms:", error);
    throw error;
  }
  
}

export const trainersList = async (page: number, limit: number) => {
  try {
    const response = await apiClient.get(`/admin/trainers?page=${page}&limit=${limit}`);
    return response.data; // Expected: { trainers, stats, page, totalPages }
  } catch (error) {
    console.error("Error fetching trainers:", error);
    throw error;
  }
};

export const toggleUserVerification = async (id: string) => {
  try {
    const response = await apiClient.put(`/admin/users/${id}/toggle-verification`);
    return response.data; 
  } catch (error) {
    console.error("Error toggling user verification:", error);
    throw error;
  }
};

///////////////////////////////////////////////////////////////////////////////////
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


export const resendTrainerOtp = async (email: string): Promise<void> => {
  const response = await apiClient.post("/auth/trainer/resend-otp", { email });
  return response.data;
};


export const trainerLogout = async (email: string) => {
  const response = await apiClient.post("/auth/trainer/logout", { email });
  return response.data;
};


export const getTrainerProfile = async (): Promise<{ trainer: TrainerProfileData }> => {
  try {
    const response = await apiClient.get("/trainer/profile");
    return response.data;
  } catch (error) {
    console.error("Get trainer profile error:", error);
    throw error;
  }
};

export const updateTrainerProfile = async (data: {
  name?: string;
  bio?: string;
  specialties?: string[];
  profilePic?: File;
  upiId?: string;
  bankAccount?: string;
  ifscCode?: string;
}) => {
  const formData = new FormData();
  if (data.name) formData.append("name", data.name);
  if (data.bio) formData.append("bio", data.bio);
  if (data.specialties) formData.append("specialties", JSON.stringify(data.specialties));
  if (data.profilePic) formData.append("profilePic", data.profilePic);
  if (data.upiId) formData.append("upiId", data.upiId);
  if (data.bankAccount) formData.append("bankAccount", data.bankAccount);
  if (data.ifscCode) formData.append("ifscCode", data.ifscCode);

  const response = await apiClient.put("/trainer/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};


export default apiClient;