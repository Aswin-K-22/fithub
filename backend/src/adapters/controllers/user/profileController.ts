// backend/src/adapters/controllers/user/profileController.ts
import { Request, Response } from "express";
import { MongoUserRepository } from "../../userRepository";

const userRepo = new MongoUserRepository();

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const email = req.user?.email;
    if (!email) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const user = await userRepo.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        profilePic: user.profilePic, 
        fitnessProfile: user.fitnessProfile || {},
        progress: user.progress || [],
        weeklySummary: user.weeklySummary || [],
      },
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const email = req.user?.email;
    if (!email) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { name } = req.body;
    const file = req.file;

    const updateData: { name?: string; profilePic?: string } = {};

    if (name) updateData.name = name;
    if (file) updateData.profilePic = `/uploads/${file.filename}`; 

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid fields provided to update" });
    }

    const updatedUser = await userRepo.updateProfile(email, updateData);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role,
          createdAt: updatedUser.createdAt,
          profilePic: updatedUser.profilePic, 
          fitnessProfile: updatedUser.fitnessProfile || {},
          progress: updatedUser.progress || [],
          weeklySummary: updatedUser.weeklySummary || [],
        },
      });
  } catch (error) {
    console.error("Update user profile error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};