// backend/src/adapters/trainerRepository.ts
import { Prisma, PrismaClient } from "@prisma/client";
import { Trainer } from "../entities/trainer";

export interface TrainerRepository {
  findByEmail(email: string): Promise<Trainer | null>;
  findById(id: string): Promise<Trainer | null>;
  create(data: Prisma.TrainerCreateInput): Promise<Trainer>;
  updateOtp(email: string, otp: string): Promise<void>;
  verifyUser(email: string): Promise<void>;
  updateRefreshToken(email: string, refreshToken: string | null): Promise<void>;
  findAvailableTrainers(): Promise<{ id: string; name: string; active: boolean }[]>;
  checkTrainerAvailability(trainerIds: string[]): Promise<{ isValid: boolean; message?: string }>;
  assignTrainersToGym(trainerIds: string[], gymId: string): Promise<void>;
  findAll(skip: number, take: number): Promise<Trainer[]>;
  count(): Promise<number>;
  countByStatus(isVerified: boolean): Promise<number>;
  countSuspended(): Promise<number>;
}

export class MongoTrainerRepository implements TrainerRepository {
  private prisma = new PrismaClient();

  constructor() {
    this.prisma.$connect()
      .then(() => console.log("Prisma connected to MongoDB"))
      .catch((err) => console.error("Prisma connection failed:", err));
  }

  async findByEmail(email: string): Promise<Trainer | null> {
    const trainer = await this.prisma.trainer.findUnique({ where: { email } });
    return trainer as Trainer | null;
  }

  async findById(id: string): Promise<Trainer | null> {
    const trainer = await this.prisma.trainer.findUnique({ where: { id } });
    return trainer as Trainer | null;
  }

  async create(data: Prisma.TrainerCreateInput): Promise<Trainer> {
    const trainer = await this.prisma.trainer.create({ data });
    return trainer as Trainer;
  }

  async updateOtp(email: string, otp: string): Promise<void> {
    await this.prisma.trainer.update({
      where: { email },
      data: {
        otp,
        otpExpires: new Date(Date.now() + 30 * 1000),
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

  async findAvailableTrainers(): Promise<{ id: string; name: string; active: boolean }[]> {
    return this.prisma.trainer.findMany({
      where: {
        gyms: { isEmpty: true },
      },
      select: {
        id: true,
        name: true,
        isVerified: true,
      },
    }).then((trainers) =>
      trainers.map((trainer) => ({
        id: trainer.id,
        name: trainer.name,
        active: trainer.isVerified,
      }))
    );
  }

  async checkTrainerAvailability(trainerIds: string[]): Promise<{ isValid: boolean; message?: string }> {
    const trainers = await Promise.all(trainerIds.map((id) => this.findById(id)));
    const unavailableTrainers = trainers.filter(
      (trainer) => !trainer || (trainer.gyms && trainer.gyms.length > 0)
    );

    if (unavailableTrainers.length > 0) {
      const unavailableNames = unavailableTrainers
        .filter((t) => t) // Filter out null trainers
        .map((t) => t!.name)
        .join(", ");
      return {
        isValid: false,
        message: `The following trainers are unavailable or already assigned: ${unavailableNames || "Some trainers not found"}`,
      };
    }

    return { isValid: true };
  }

  async assignTrainersToGym(trainerIds: string[], gymId: string): Promise<void> {
    await this.prisma.trainer.updateMany({
      where: { id: { in: trainerIds } },
      data: { gyms: [gymId] }, // Assign the gym ID
    });
  }


  async findAll(skip: number, take: number): Promise<Trainer[]> {
    return this.prisma.trainer.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        specialties: true,
        experienceLevel: true,
        isVerified: true,
        profilePic: true,
        createdAt: true,
        ratings: {
          select: {
            average: true,
            count: true,
            reviews: true, 
          },
        },
      },
    }) as Promise<Trainer[]>;
  }

  async count(): Promise<number> {
    return this.prisma.trainer.count();
  }

  async countByStatus(isVerified: boolean): Promise<number> {
    return this.prisma.trainer.count({ where: { isVerified } });
  }

  async countSuspended(): Promise<number> {

    return this.prisma.trainer.count({
      where: { isVerified: false, gyms: { isEmpty: true } },
    });
  }
}