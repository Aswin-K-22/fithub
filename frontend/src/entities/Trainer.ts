export interface Trainer {
    name: string;
    email: string;
    specialization: string;
    experience: string;
    rating: number;
    status: "Active" | "Pending" | "Suspended";
    avatar: string;
  }



  export interface TrainerProfileData {
    id: string;
    name: string;
    email: string;
    role: string;
    profilePic?: string;
    bio?: string;
    specialties?: string[];
    experienceLevel?: string;
    certifications?: {
      name: string;
      issuer: string;
      dateEarned: string; // Converted from DateTime to ISO string
      certificateId: string;
    }[];
    clients?: {
      userId: string;
      membershipId?: string;
      startDate: string; // ISO string
      active: boolean;
    }[];
    paymentDetails?: {
      method?: string;
      rate?: number;
      currency?: string;
      paymentHistory?: {
        paymentId: string;
        amount: number;
        date: string; // ISO string
        periodStart?: string;
        periodEnd?: string;
        clientCount?: number;
        hoursWorked?: number;
      }[];
    };
    availability?: {
      day: string;
      startTime: string;
      endTime: string;
    }[];
    gyms?: string[];
    createdAt?: string; // ISO string
    updatedAt?: string; // ISO string
  }