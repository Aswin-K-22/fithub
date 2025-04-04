// backend/src/adapters/membershipRepository.ts
import { Prisma, PrismaClient } from "@prisma/client";
import {MembershipPlan } from "../entities/membershipPlan";

export interface MembershipRepository {
  createPlan(data: Prisma.MembershipPlanCreateInput): Promise<MembershipPlan>;
  findAllPlans(skip: number, take: number): Promise<MembershipPlan[]>;
  countPlans(): Promise<number>;
  findPlanById(id: string): Promise<MembershipPlan | null>;
  
}

export class MongoMembershipRepository implements MembershipRepository {
  private prisma = new PrismaClient();

  constructor() {
    this.prisma.$connect()
      .then(() => console.log("Prisma connected to MongoDB"))
      .catch((err) => console.error("Prisma connection failed:", err));
  }

  async createPlan(data: Prisma.MembershipPlanCreateInput): Promise<MembershipPlan> {
    return this.prisma.membershipPlan.create({ data });
  }

  async findAllPlans(skip: number, take: number): Promise<MembershipPlan[]> {
    return this.prisma.membershipPlan.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
  }

  async countPlans(): Promise<number> {
    return this.prisma.membershipPlan.count();
  }

  async findPlanById(id: string): Promise<MembershipPlan | null> {
    return this.prisma.membershipPlan.findUnique({ where: { id } });
  }


}