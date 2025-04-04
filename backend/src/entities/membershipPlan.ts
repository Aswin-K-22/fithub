// backend/src/entities/membershipPlan.ts
export interface MembershipPlan {
    id: string;
    name: string;
    description?: string | null;
    price: number; // Float in Prisma maps to number in TypeScript
    duration: number; // Duration in months
    features: string[]; // e.g., ["24/7-access", "group-classes"]
    createdAt: Date;
    updatedAt: Date;
    memberships?: Membership[]; // Optional relation
  }
  
  export interface Membership {
    id: string;
    userId: string;
    planId: string;
    startDate: Date;
    endDate: Date;
    status: "active" | "expired" | "cancelled";
    paymentId?: string | null; // Link to Payment model
    createdAt: Date;
    updatedAt: Date;
  }