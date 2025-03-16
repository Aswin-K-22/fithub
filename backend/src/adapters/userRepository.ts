import { PrismaClient } from "@prisma/client";
import { User } from "../entities/user";

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User>;
}

export class MongoUserRepository implements UserRepository {
  private prisma = new PrismaClient();

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }
  async create(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    return this.prisma.user.create({ data });
  }
}