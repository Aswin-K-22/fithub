// entities/Gym.ts
export interface Gym {
  id: string;
  name: string;
  type: string;
  description?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    lat?: number;
    lng?: number;
  };
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  equipment?: {
    type: string;
    category: string;
    quantity: number;
    condition: string;
  }[];
  schedule?: {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    isClosed: boolean;
    slotDuration: number;
    slotCapacity: number;
  }[];
  trainers?: {
    trainerId: string;
    active: boolean;
  }[];
  facilities?: {
    hasPool: boolean;
    hasSauna: boolean;
    hasParking: boolean;
    hasLockerRooms: boolean;
    hasWifi: boolean;
    hasShowers: boolean;
  };
  images: {
    url: string;
    description?: string;
    uploadedAt: Date;
  }[];
  ratings?: {
    average?: number;
    count?: number;
    reviews?: {
      userId: string;
      rating: number;
      comment?: string;
      date: Date;
    }[];
  };
  maxCapacity: number;
  membershipCompatibility: string[];
  createdAt: Date;
  updatedAt: Date;
}

  export interface GymAddSchema {
    name: string;
    type: "Premium" | "Basic" | "Diamond";
    description: string;
    address: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      lat: string;
      lng: string;
    };
    contact: {
      phone: string;
      email: string;
      website: string;
    };
    facilities?: string[];
    equipment?: Array<{
      type: string;
      category: string;
      quantity: number;
      condition: string;
    }>;
    schedule: Array<{
      dayOfWeek: string;
      startTime: string;
      endTime: string;
      isClosed: boolean;
      slotDuration: number;
      slotCapacity: number;
    }>;
    maxCapacity: number;
    trainers?: Array<{
      trainerId: string;
      active: boolean;
    }>;
    images?: string[]; 
  }