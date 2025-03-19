import { User } from "../entities/user";
import { UserRepository } from "../adapters/userRepository";
import * as bcrypt from "bcrypt";

export class AuthenticateUser {
    constructor(private userRepo: UserRepository) {}
    async execute(email: string, password: string): Promise<{  user: User }> {
        const user = await this.userRepo.findByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
          throw new Error("Invalid email1 or password");
        }
        return { user };
      }
      
    }