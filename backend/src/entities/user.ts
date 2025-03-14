export interface User {
    id: string;
    email: string;
    password: string;
    role: string;
    name?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  }

  