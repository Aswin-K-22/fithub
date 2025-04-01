export interface Gym {
    name: string;
    description: string;
    location: string;
    subLocation: string;
    contact: string;
    email: string;
    rating: number;
    status: "Active" | "Pending" | "Suspended";
    image: string;
  }