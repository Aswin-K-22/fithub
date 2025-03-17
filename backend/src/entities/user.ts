export interface User {
  id: string;
  email: string;
  password: string;
  role: string;
  name: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  otp?: string | null;
  otpExpires?: Date | null;
  isVerified?: boolean;
  refreshToken?: string | null;
  }

  