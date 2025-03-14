import { User } from "../entities/user";
import { UserRepository } from "../adapters/userRepository";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

export class AuthenticateUser {
    constructor(private userRepo: UserRepository) {}
    async execute(email: string, password: string): Promise<{ token: string; user: User }> {
        const user = await this.userRepo.findByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
          throw new Error("Invalid email1 or password");
        }
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "1h" });
        return { token, user };
      }
    }