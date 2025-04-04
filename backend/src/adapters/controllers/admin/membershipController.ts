// backend/src/adapters/controllers/admin/membershipController.ts
import { Request, Response } from "express";
import { MongoMembershipRepository } from "../../membershipRepository";

const membershipRepo = new MongoMembershipRepository();

export const addMembershipPlan = async (req: Request, res: Response) => {
  try {
    const { name, description, price, duration, features } = req.body;
    const planData = {
      name,
      description,
      price: parseFloat(price),
      duration: parseInt(duration),
      features,
    };
    const newPlan = await membershipRepo.createPlan(planData);
    res.status(201).json({ message: "Membership plan created", plan: newPlan });
  } catch (error) {
    console.error("Error adding membership plan:", error);
    res.status(500).json({ message: "Failed to create membership plan" });
  }
};

export const getMembershipPlans = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const plans = await membershipRepo.findAllPlans(skip, limit);
    const total = await membershipRepo.countPlans();

    res.status(200).json({
      plans,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching membership plans:", error);
    res.status(500).json({ message: "Failed to fetch membership plans" });
  }
};