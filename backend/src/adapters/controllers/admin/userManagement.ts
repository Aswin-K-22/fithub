// backend/src/adapters/controllers/admin/userManagement.ts
import { Request, Response } from "express";
import { MongoUserRepository } from "../../userRepository";

const userRepository = new MongoUserRepository();

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 3;

    const users = await userRepository.findAllUsers(page, limit);
    const totalUsers = await userRepository.countUsers();
    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      success: true,
      users,
      page,
      totalPages,
      totalUsers,
    });
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const toggleUserVerification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedUser = await userRepository.toggleUserVerification(id);
    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error in toggleUserVerification:", error);
    res.status(500).json({ success: false, message: "Failed to toggle user verification" });
  }
};