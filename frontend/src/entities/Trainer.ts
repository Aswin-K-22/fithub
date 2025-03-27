export interface Trainer {
    name: string;
    email: string;
    specialization: string;
    experience: string;
    rating: number;
    status: "Active" | "Pending" | "Suspended";
    avatar: string;
  }