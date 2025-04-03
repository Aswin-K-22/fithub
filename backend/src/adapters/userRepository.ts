// backend/src/adapters/userRepository.ts
import { Prisma, PrismaClient } from "@prisma/client";
import { User, UserWithoutSensitiveData } from "../entities/user";

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findAllUsers(page: number, limit: number): Promise<UserWithoutSensitiveData[]>;
  countUsers(): Promise<number>;
  create(data: Prisma.UserCreateInput): Promise<User>;
  updateOtp(email: string, otp: string): Promise<void>;
  verifyUser(email: string): Promise<void>;
  updateRefreshToken(email: string, refreshToken: string | null): Promise<void>;
  toggleUserVerification(id: string): Promise<UserWithoutSensitiveData>; // New method
}

export class MongoUserRepository implements UserRepository {
  private prisma = new PrismaClient();

  constructor() {
    this.prisma.$connect()
      .then(() => console.log("Prisma connected to MongoDB"))
      .catch((err) => console.error("Prisma connection failed:", err));
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
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
    try {
      await this.prisma.user.update({
        where: { email },
        data: { refreshToken },
      });
    } catch (error) {
      console.error("Error updating refresh token:", error);
    }
  }

  async findAllUsers(page: number, limit: number = 3): Promise<UserWithoutSensitiveData[]> {
    try {
      const skip = (page - 1) * limit;
      const users = await this.prisma.user.findMany({
        where: { role: "user" },
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          role: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          isVerified: true,
          membershipId: true,
          fitnessProfile: true,
          workoutPlanId: true,
          progress: true,
          weeklySummary: true,
          profilePic: true,
          memberships: {
            select: {
              plan: { select: { name: true } },
              status: true,
            },
            where: { status: { in: ["Active", "Suspended", "Pending"] } },
            orderBy: { startDate: "desc" },
            take: 1,
          },
        },
      });
      return users.map(user => ({
        ...user,
        membership: user.memberships[0]?.plan?.name,
        status: user.memberships[0]?.status,
      }));
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  }

  async countUsers(): Promise<number> {
    return this.prisma.user.count({ where: { role: "user" } });
  }

  async toggleUserVerification(id: string): Promise<UserWithoutSensitiveData> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error("User not found");

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { isVerified: !user.isVerified },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        isVerified: true,
        membershipId: true,
        fitnessProfile: true,
        workoutPlanId: true,
        progress: true,
        weeklySummary: true,
        profilePic: true,
        memberships: {
          select: {
            plan: { select: { name: true } },
            status: true,
          },
          where: { status: { in: ["Active", "Suspended", "Pending"] } },
          orderBy: { startDate: "desc" },
          take: 1,
        },
      },
    });

    return {
      ...updatedUser,
      membership: updatedUser.memberships[0]?.plan?.name,
      status: updatedUser.memberships[0]?.status,
    };
  }
}