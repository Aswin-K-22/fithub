// src/adapters/controllers/admin/TrainerManagement.ts
import { Request, Response } from "express";
import { AddTrainerData } from "../../../entities/trainer";
import { transporter } from "../../../adapters/config/emailConfig";
import * as bcrypt from "bcrypt";
import { MongoTrainerRepository } from "../../trainerRepository";

const trainerRepository = new MongoTrainerRepository();

export const addTrainer = async (req: Request, res: Response) => {
  try {
    const { name, email, password, specialties, experienceLevel, bio, phone }: AddTrainerData = req.body;
    const existingTrainer = await trainerRepository.findByEmail(email);
    if (existingTrainer) {
      return res.status(400).json({ message: "Trainer with this email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const trainer = await trainerRepository.create({
      name,
      email,
      password: hashedPassword,
      specialties,
      experienceLevel,
      bio,
      role: "trainer",
      personalDetails: { phone },
      isVerified: true,
      gyms: [],
    });
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "FitHub Trainer Account Created",
        text: `Hello ${name},\n\nYour trainer account has been created successfully.\n\nLogin Credentials:\nEmail: ${email}\nPassword: ${password}\n\nPlease log in and change your password for security.\n\nBest regards,\nFitHub Team`,
      });
    } catch (emailError) {
      console.error("Email send failed:", emailError);
    }
    res.status(201).json({
      message: "Trainer added successfully. Login credentials sent to email",
      trainerId: trainer.id,
    });
  } catch (error) {
    console.error("Add trainer error:", error);
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getAvailableTrainers = async (req: Request, res: Response) => {
  try {
    const trainers = await trainerRepository.findAvailableTrainers();
    res.status(200).json({ success: true, trainers });
  } catch (error) {
    console.error("Error fetching trainers:", error);
    res.status(500).json({ success: false, message: "Internal server error while fetching trainers" });
  }
};

export const getTrainers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const skip = (page - 1) * limit;

    const trainers = await trainerRepository.findAll(skip, limit);
    const totalTrainers = await trainerRepository.count();

    const stats = {
      totalTrainers,
      pendingApproval: await trainerRepository.countByStatus(false), // Not verified
      activeTrainers: await trainerRepository.countByStatus(true), // Verified
      suspended: await trainerRepository.countSuspended(), // Add logic for suspended if applicable
    };

    res.status(200).json({
      success: true,
      trainers,
      stats,
      page,
      totalPages: Math.ceil(totalTrainers / limit),
    });
  } catch (error) {
    console.error("Error fetching trainers:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching trainers",
    });
  }
};