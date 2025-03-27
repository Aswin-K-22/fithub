import { Prisma ,PrismaClient } from "@prisma/client";
import { User ,UserWithoutSensitiveData} from "../entities/user";

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findAllUsers():Promise<UserWithoutSensitiveData[] | null>;
  create(data: Prisma.UserCreateInput): Promise<User>;
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
  async findById(id: string): Promise<User | null>{
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
      const updatedUser = await this.prisma.user.update({
        where: { email },
        data: { refreshToken },
      });
      console.log("Updated User:", updatedUser);
    } catch (error) {
      console.error("Error updating refresh token:", error);
    }
  }
  async findAllUsers(): Promise<UserWithoutSensitiveData[] | null> {
    try {
      const users = await this.prisma.user.findMany({
        where: { role: 'user' },
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
        },
      });
      console.log("Fetched users:", users);
      return users;
    } catch (error) {
      console.error("Error fetching all users:", error);
      return null;
    }
  }


}