// src/adapters/trainerRepository.ts
import { Prisma, PrismaClient } from "@prisma/client";
import { Trainer, AddTrainerData } from "../entities/trainer";

export interface TrainerRepository {
  findByEmail(email: string): Promise<Trainer | null>;
  findById(email: string): Promise<Trainer | null>;
  create(data: Prisma.TrainerCreateInput): Promise<Trainer>;
  updateOtp(email: string, otp: string): Promise<void>;
  verifyUser(email: string): Promise<void> ;
  updateRefreshToken(email: string, refreshToken: string | null): Promise<void> 
}

export class MongoTrainerRepository implements TrainerRepository {
  private prisma = new PrismaClient();

  constructor() {
    this.prisma.$connect()
      .then(() => console.log("Prisma connected to MongoDB"))
      .catch((err) => console.error("Prisma connection failed:", err));
  }

  async findByEmail(email: string): Promise<Trainer | null> {
    return this.prisma.trainer.findUnique({ where: { email } });
  }

  
  async findById(id: string): Promise<Trainer | null> {
    return this.prisma.trainer.findUnique({ where: { id } });
  }

  
  async create(data: Prisma.TrainerCreateInput): Promise<Trainer> {
    return this.prisma.trainer.create({ data });
  }
  async updateOtp(email: string, otp: string): Promise<void> {
    await this.prisma.trainer.update({
      where: { email },
      data: { 
        otp, 
        otpExpires: new Date(Date.now() +   30 * 1000),
        
      },
    });
  }

  async verifyUser(email: string): Promise<void> {
    await this.prisma.trainer.update({
      where: { email },
      data: { isVerified: true, otp: null, otpExpires: null },
    });
  }

  async updateRefreshToken(email: string, refreshToken: string | null): Promise<void> {
    try {
      const updatedTrainer = await this.prisma.trainer.update({
        where: { email },
        data: { refreshToken },
      });
      console.log("Updated trainer:", updatedTrainer);
    } catch (error) {
      console.error("Error updating refresh token:", error);
    }
  }
}