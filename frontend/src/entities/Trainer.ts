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
      dateEarned: string; 
      certificateId: string;
    }[];
    clients?: {
      userId: string;
      membershipId?: string;
      startDate: string; 
      active: boolean;
    }[];
    paymentDetails?: {
      ifscCode?: string  ;
      bankAccount?: string ;
      upiId?: string ;
      method?: string;
      rate?: number;
      currency?: string;
      paymentHistory?: {
        paymentId: string;
        amount: number;
        date: string; 
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
    createdAt?: string;
    updatedAt?: string; 
  }