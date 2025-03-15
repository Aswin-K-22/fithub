import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000/api",
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