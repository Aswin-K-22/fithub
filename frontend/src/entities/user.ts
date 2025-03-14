export interface User {
    id: string;
    email: string;
    role: "user" | "trainer" | "admin";
    name?: string;
  }