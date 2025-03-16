import { PrismaClient } from "@prisma/client";
import { User } from "../entities/user";

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User>;
  updateOtp(email: string, otp: string): Promise<void>;
}

export class MongoUserRepository implements UserRepository {
  private prisma = new PrismaClient();

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }
  async create(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async updateOtp(email: string, otp: string): Promise<void> {
    await this.prisma.user.update({
      where: { email },
      data: { otp, otpExpires: new Date(Date.now() + 10 * 60 * 1000) },
    });
  }
}