// src/entities/gym.ts
export interface Gym {
    id: string;
    name: string;
    type: string; // "budget", "premium", "specialty"
    description?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      postalCode?: string;
      coordinates?: [number, number]; // [lat, lng]
    };
    contact?: {
      phone?: string;
      email?: string;
      website?: string;
    };
    equipment?: {
      type: string; // e.g., "treadmill"
      category: string; // "basic", "electrical", "specialized"
      quantity: number;
      condition: string; // "new", "used", "maintenance"
    }[];
    timeSlots?: {
      day: string; // e.g., "Monday"
      open: string; // e.g., "06:00"
      close: string; // e.g., "22:00"
      isClosed: boolean;
    }[];
    trainers?: {
      trainerId: string; // Reference to Trainer
      startDate: Date;
      active: boolean;
    }[];
    suggestedPlan?: string | null; // Reference to WorkoutPlan
    facilities?: {
      hasPool: boolean;
      hasSauna: boolean;
      hasParking: boolean;
      hasLockerRooms: boolean;
    };
    capacity?: {
      max: number;
      current: number;
    };
    membershipCompatibility?: string[]; // e.g., ["basic", "platinum", "diamond"]
    images?: {
      url: string;
      description?: string;
      uploadedAt: Date;
    }[];
    ratings?: {
      average?: number;
      count?: number;
      reviews?: {
        userId: string; // Reference to User
        rating: number;
        comment?: string;
        date: Date;
      }[];
    };
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export default Gym;