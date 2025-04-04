// backend/src/adapters/controllers/admin/membershipController.ts
import type { Request, Response } from "express";
import { MongoMembershipRepository, MembershipRepository } from "../../membershipRepository";

const membershipRepository: MembershipRepository = new MongoMembershipRepository();


export const getMembershipPlansForUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 3; // Default to 3 for user page
    const skip = (page - 1) * limit;

    const plans = await membershipRepository.findAllPlans(skip, limit);
    const total = await membershipRepository.countPlans();

    res.status(200).json({ plans, total });
  } catch (error) {
    console.error("Error fetching membership plans for users:", error);
    res.status(500).json({ message: "Failed to fetch membership plans" });
  }
};