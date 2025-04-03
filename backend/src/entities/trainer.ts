// backend/src/entities/trainer.ts
export interface Trainer {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  profilePic?: string;
  isVerified: boolean;
  otp?: string | null;
  otpExpires?: Date | null;
  refreshToken?: string | null;
  personalDetails?: Record<string, any>;
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
    rate?: number | null | undefined;
    currency?: string | null;
    paymentHistory?: {
      paymentId: string;
      amount: number | undefined;
      date: Date;
      periodStart?: Date | null;
      periodEnd?: Date | null;
      clientCount?: number | null;
      hoursWorked?: number | null | undefined;
    }[];
  } | null;
  availability?: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  gyms?: string[];
  createdAt: Date;
  updatedAt: Date;
  phone?: string;
  bookings?: {
    id: string;
    userId: string;
    gymId: string;
    trainerId?: string | null;
    slot: {
      date: Date;
      startTime: string;
      endTime: string;
      duration: number;
    };
    status: string;
    qrCode: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  payments?: {
    id: string;
    type: string;
    userId?: string | null;
    trainerId?: string | null;
    membershipId?: string | null;
    bookingId?: string | null;
    amount: number;
    currency: string;
    paymentGateway?: string | null;
    paymentId?: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  ratings?: { // Replace rating?: number
    average?: number;
    count?: number;
    reviews: {
      userId: string;
      rating: number;
      comment?: string | null;
      date: Date;
    }[];
  };
}

export interface AddTrainerData {
  name: string;
  email: string;
  password: string;
  specialties: string[];
  experienceLevel: string;
  bio: string;
  phone?: string;
}