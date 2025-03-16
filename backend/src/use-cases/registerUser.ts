import { User } from "../entities/user";
import { UserRepository } from "../adapters/userRepository";
import * as bcrypt from "bcrypt";

export class RegisterUser {
  constructor(private userRepo: UserRepository) {}

  async execute(name: string, email: string, password: string): Promise<User> {
    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) throw new Error("Email already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userRepo.create({
      email,
      password: hashedPassword,
      name,
      role: "user", // Default role
    });

    return user;
  }
}