// src/adapters/controllers/admin/TrainerManagement.ts
import { Request, Response } from "express";
import { AddTrainerData } from "../../../entities/trainer";
import { transporter } from "../../../adapters/config/emailConfig";
import * as bcrypt from "bcrypt";
import { MongoTrainerRepository } from "../../trainerRepository";

const trainerRepository = new MongoTrainerRepository();

export const addTrainer = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      password,
      specialties,
      experienceLevel,
      bio,
      phone,
   
    }: AddTrainerData = req.body;

    console.log("Fields extracted:", {
      name,
      email,
      password,
      specialties,
      experienceLevel,
      bio,
      phone,

    });

    const existingTrainer = await trainerRepository.findByEmail(email);

    if (existingTrainer) {
    res.status(400)
        .json({ message: "Trainer with this email already exists" });

        return
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new trainer
    const trainer = await trainerRepository.create({
      name,
      email,
      password: hashedPassword,
      specialties,
      experienceLevel,
      bio,
      role: "trainer", // Required field
      personalDetails: {
        phone, // Directly assign the object, no 'create' needed
      },
    // Direct assignment since gyms is String[]
      isVerified: true, // No OTP needed
    });

    // Send email with login credentials
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "FitHub Trainer Account Created",
        text: `Hello ${name},\n\nYour trainer account has been created successfully.\n\nLogin Credentials:\nEmail: ${email}\nPassword: ${password}\n\nPlease log in and change your password for security.\n\nBest regards,\nFitHub Team`,
      });
      console.log("Credentials email sent to trainer");
    } catch (emailError) {
      console.error("Email send failed:", emailError);
      // Not failing the request if email fails
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