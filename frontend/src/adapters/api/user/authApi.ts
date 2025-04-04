import { forgotPassword, resetPassword, login, signup } from "../../../lib/api/authApi";

export const userApiRepository = {
  forgotPassword: (email: string) => forgotPassword(email),
  resetPassword: (email: string, otp: string, newPassword: string) => resetPassword(email, otp, newPassword),
  login: (email: string, password: string) => login(email, password),
  signup: (name: string, email: string, password: string) => signup(name, email, password),
};