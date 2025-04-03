// adapters/gymRepository.ts
import { Prisma, PrismaClient } from "@prisma/client";
import { Gym } from "../entities/gym";

export interface GymRepository {
  findByName(name: string): Promise<Gym | null>;
  create(data: Prisma.GymCreateInput): Promise<Gym>;
  findAll(skip: number, take: number): Promise<Gym[]>;
  count(): Promise<number>;
}

export class MongoGymRepository implements GymRepository {
  private prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

  constructor() {
    this.prisma.$connect()
      .then(() => console.log("Prisma connected to MongoDB"))
      .catch((err) => console.error("Prisma connection failed:", err));
  }

  async findByName(name: string): Promise<Gym | null> {
    return this.prisma.gym.findUnique({
      where: { name },
      include: {
        bookings: true,
      },
    });
  }

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    return this.prisma.gym.create({
      data,
      include: {
        bookings: true,
      },
    });
  }

  async findAll(skip: number, take: number): Promise<Gym[]> {
    return this.prisma.gym.findMany({
      skip,
      take,
      orderBy: {
        createdAt: "desc", 
      },
      include: {
        bookings: true,
      },
    });
  }

  async count(): Promise<number> {
    return this.prisma.gym.count();
  }
}