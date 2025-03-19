import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ user: User; }>) {
        state.user = action.payload.user;
        state.isAuthenticated = true;
      },
      logout(state) {
        state.user = null;
        state.isAuthenticated = false;
      },
    signup(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
 
  },
});

export const { login, signup, logout } = authSlice.actions;
export default authSlice.reducer;