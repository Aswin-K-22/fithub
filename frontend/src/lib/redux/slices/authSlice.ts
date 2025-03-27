import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "trainer";
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const loadStateFromLocalStorage = (): AuthState => {
  const savedState = localStorage.getItem("authState");
  return savedState
    ? JSON.parse(savedState)
    : { user: null, isAuthenticated: false };
};

const initialState: AuthState = loadStateFromLocalStorage();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("authState", JSON.stringify(state));
    },
    signup(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("authState", JSON.stringify(state));
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("authState");
    },
  },
});

export const { login, signup, logout } = authSlice.actions;
export default authSlice.reducer;