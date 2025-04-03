// backend/src/adapters/gymRepository.ts
import { Prisma, PrismaClient } from "@prisma/client";
import { Gym, GymForUsers } from "../entities/gym";

export interface GymRepository {
  findByName(name: string): Promise<Gym | null>;
  create(data: Prisma.GymCreateInput): Promise<Gym>;
  findAll(skip: number, take: number): Promise<Gym[]>;
  count(): Promise<number>;
  findAllForUsers(
    skip: number,
    take: number,
    filters: {
      search?: string;
      location?: string;
      gymType?: string;
      rating?: string;
    }
  ): Promise<GymForUsers[]>;
  countWithFilters(filters: {
    search?: string;
    location?: string;
    gymType?: string;
    rating?: string;
  }): Promise<number>;
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
      include: { bookings: true },
    });
  }

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    return this.prisma.gym.create({
      data,
      include: { bookings: true },
    });
  }

  async findAll(skip: number, take: number): Promise<Gym[]> {
    return this.prisma.gym.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: { bookings: true },
    });
  }

  async count(): Promise<number> {
    return this.prisma.gym.count();
  }

  async findAllForUsers(
    skip: number,
    take: number,
    filters: {
      search?: string;
      location?: string;
      gymType?: string;
      rating?: string;
    }
  ): Promise<GymForUsers[]> {
    const whereBase: Prisma.GymWhereInput = {};
  
    if (filters.location && filters.location !== "Select State") {
      whereBase.address = {
        is: {
          state: { contains: filters.location, mode: "insensitive" },
        },
      };
    }
    if (filters.gymType && filters.gymType !== "All Types") {
      whereBase.type = filters.gymType;
    }
    if (filters.rating && filters.rating !== "Any Rating") {
      const minRating = parseFloat(filters.rating);
      whereBase.ratings = {
        is: {
          average: { gte: minRating },
        },
      };
    }
  
    let gyms: any[] = [];
  
    if (filters.search) {
      // Step 1: Fetch gyms starting with the search term
      const startsWithGyms = await this.prisma.gym.findMany({
        where: {
          ...whereBase,
          name: { startsWith: filters.search, mode: "insensitive" },
        },
        orderBy: [{ name: "asc" }],
        select: {
          id: true,
          name: true,
          address: true,
          type: true,
          images: true,
          ratings: true,
        },
      });
  
      // Step 2: Fetch gyms containing the search term (excluding startsWith matches)
      const containsGyms = await this.prisma.gym.findMany({
        where: {
          ...whereBase,
          name: { contains: filters.search, mode: "insensitive" },
          NOT: startsWithGyms.map(gym => ({ id: gym.id })), // Avoid duplicates
        },
        orderBy: [{ name: "asc" }],
        select: {
          id: true,
          name: true,
          address: true,
          type: true,
          images: true,
          ratings: true,
        },
      });
  
      // Combine: startsWith first, then contains
      gyms = [...startsWithGyms, ...containsGyms];
    } else {
      gyms = await this.prisma.gym.findMany({
        where: whereBase,
        orderBy: [{ name: "asc" }],
        select: {
          id: true,
          name: true,
          address: true,
          type: true,
          images: true,
          ratings: true,
        },
      });
    }
  
    // Apply pagination
    const paginatedGyms = gyms.slice(skip, skip + take);
  
    console.log("Fetched Gyms:", paginatedGyms.map(g => g.name));
  
    return paginatedGyms.map((gym) => ({
      id: gym.id,
      name: gym.name,
      address: gym.address || null,
      type: gym.type || null,
      image: gym.images?.[0]?.url || undefined,
      ratings: gym.ratings || null,
    }));
  }
  
  async countWithFilters(filters: {
    search?: string;
    location?: string;
    gymType?: string;
    rating?: string;
  }): Promise<number> {
    const where: Prisma.GymWhereInput = {};
  
    if (filters.search) {
      where.OR = [
        { name: { startsWith: filters.search, mode: "insensitive" } },
        { name: { contains: filters.search, mode: "insensitive" } },
      ];
    }
    if (filters.location && filters.location !== "Select State") {
      where.address = {
        is: {
          state: { contains: filters.location, mode: "insensitive" },
        },
      };
    }
    if (filters.gymType && filters.gymType !== "All Types") {
      where.type = filters.gymType;
    }
    if (filters.rating && filters.rating !== "Any Rating") {
      const minRating = parseFloat(filters.rating);
      where.ratings = {
        is: {
          average: { gte: minRating },
        },
      };
    }
  
    return this.prisma.gym.count({ where });
  }
}