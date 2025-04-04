// backend/src/adapters/controllers/trainer/trainerProfileController.ts
import { Request, Response } from "express";
import { MongoTrainerRepository } from "../../trainerRepository";

const trainerRepo = new MongoTrainerRepository();

export const getTrainerProfile = async (req: Request, res: Response) => {
  try {
    const email = req.trainer?.email;
    if (!email) {
      return res.status(401).json({ message: "Trainer not authenticated" });
    }
    const trainer = await trainerRepo.findByEmail(email);
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }
    res.status(200).json({
      trainer: {
        id: trainer.id,
        name: trainer.name,
        email: trainer.email,
        role: trainer.role,
        profilePic: trainer.profilePic,
        bio: trainer.bio,
        specialties: trainer.specialties || [],
        experienceLevel: trainer.experienceLevel,
        paymentDetails: trainer.paymentDetails || {},
        availability: trainer.availability || [],
        gyms: trainer.gyms || [],
        createdAt: trainer.createdAt?.toISOString(),
        updatedAt: trainer.updatedAt?.toISOString(),
      },
    });
  } catch (error) {
    console.error("Get trainer profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTrainerProfile = async (req: Request, res: Response) => {
  try {
    const email = req.trainer?.email;
    if (!email) {
      return res.status(401).json({ message: "Trainer not authenticated" });
    }

    const { name, bio, specialties, upiId, bankAccount, ifscCode } = req.body;
    const file = req.file; // From multer

    const updateData: Partial<any> = {};
    if (name) updateData.name = name;
    if (bio) updateData.bio = bio;
    if (specialties) updateData.specialties = JSON.parse(specialties); // Assuming specialties come as a JSON string from FormData
    if (file) updateData.profilePic = `/uploads/${file.filename}`;
    if (upiId || bankAccount || ifscCode) {
      updateData.paymentDetails = {
        upiId: upiId || undefined,
        bankAccount: bankAccount || undefined,
        ifscCode: ifscCode || undefined,
      };
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid fields provided to update" });
    }

    const updatedTrainer = await trainerRepo.updateProfile(email, updateData);
    res.status(200).json({
      trainer: {
        id: updatedTrainer.id,
        name: updatedTrainer.name,
        email: updatedTrainer.email,
        role: updatedTrainer.role,
        profilePic: updatedTrainer.profilePic,
        bio: updatedTrainer.bio,
        specialties: updatedTrainer.specialties || [],
        paymentDetails: updatedTrainer.paymentDetails || {},
      },
    });
  } catch (error) {
    console.error("Update trainer profile error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};