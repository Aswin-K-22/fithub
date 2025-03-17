import { PrismaClient } from "@prisma/client";
import { User } from "../entities/user";

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User>;
  updateOtp(email: string, otp: string): Promise<void>;
  verifyUser(email: string): Promise<void>;
  updateRefreshToken(email: string, refreshToken: string | null): Promise<void>;
}

export class MongoUserRepository implements UserRepository {
  private prisma = new PrismaClient();

  constructor() {
    this.prisma.$connect()
      .then(() => console.log("Prisma connected to MongoDB"))
      .catch((err) => console.error("Prisma connection failed:", err));
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }
  async create(data: Omit<User, "id" | "createdAt" | "updatedAt" >): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async updateOtp(email: string, otp: string): Promise<void> {
    await this.prisma.user.update({
      where: { email },
      data: { 
        otp, 
        otpExpires: new Date(Date.now() + 30 * 1000),
        isVerified: false, 
      },
    });
  }
  
  async verifyUser(email: string): Promise<void> {
    await this.prisma.user.update({
      where: { email },
      data: { isVerified: true, otp: null, otpExpires: null },
    });
  }

  async updateRefreshToken(email: string, refreshToken: string | null): Promise<void> {
    await this.prisma.user.update({
      where: { email },
      data: { refreshToken },
    });
  }
}