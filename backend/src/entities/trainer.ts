// src/entities/trainer.ts
export interface Trainer {
  id: string;
  name: string;
  email: string;
  password: string;
  role : string;
  isVerified?: boolean;
  otp?: string | null;
  otpExpires?: Date | null;
  refreshToken?: string | null;
  personalDetails?: any; // Use any to match JsonValue, or define a more permissive type
  certifications?: {
    name: string;
    issuer: string;
    dateEarned: Date;
    certificateId: string;
  }[];
  bio?: string | null;
  specialties?: string[];
  experienceLevel?: string | null;
  clients?: {
    userId: string;
    membershipId?: string | null;
    startDate: Date;
    active: boolean;
  }[];
  paymentDetails?: {
    method?: string | null;
    rate?: number | null;
    currency?: string | null;
    paymentHistory?: {
      paymentId: string;
      amount: number;
      date: Date;
      periodStart?: Date | null;
      periodEnd?: Date | null;
      clientCount?: number | null;
      hoursWorked?: number | null;
    }[];
  } | null;
  availability?: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  gyms?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AddTrainerData {
  name: string;
  email: string;
  password: string;
  specialties: string[];
  experienceLevel: string;
  bio: string;
  phone: string;
 
}

export default Trainer;