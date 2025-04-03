// entities/gym.ts
import { Prisma } from "@prisma/client";

export interface AddGym {
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

export type Gym = Prisma.GymGetPayload<{
  include: {
    bookings: true; // Only bookings as a relation
  };
}>;