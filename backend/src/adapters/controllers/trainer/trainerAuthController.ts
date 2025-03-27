import { Request, Response } from "express";
import { MongoTrainerRepository } from "../../trainerRepository";
import { AuthenticateTrainer } from "../../../use-cases/authenticateTrainer";
import * as jwt from "jsonwebtoken";
import { generateOtp } from "../../config/otpGenerate";
import { transporter } from "../../config/emailConfig";
import { generateAccessToken, generateRefreshToken } from "../../config/tokens";


declare module "express" {
  interface Request {
    trainer?: { id: string; email: string };
  }
}
const trainerRepo = new MongoTrainerRepository();
const authTrainer = new AuthenticateTrainer(trainerRepo);
console.log("Authtrainer created");

export const getTrainer = async (req: Request, res: Response) => {
  try {
    if (!req.trainer) {
      res.status(401).json({ message: "Trainer not authenticated" });
      return;
    }
    const email = req.trainer?.email;
    if (!email) {
      res.status(401).json({ message: "Trainer not authenticated" });
      return;
    }
    const trainer = await trainerRepo.findByEmail(email);
    if (!trainer) {
      res.status(404).json({ message: "Trainer not found" });
      return;
    }
    res.status(200).json({ trainer: { id: trainer.id, email: trainer.email, name: trainer.name, role: trainer.role } });
  } catch (error) {
    console.error("Get trainer error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const trainerLogin = async (req: Request, res: Response) => {
  try {
    console.log("trainer login function");
    const { email, password } = req.body;
    const { trainer } = await authTrainer.execute(email, password);
    console.log("trainer verified");
    const otp = generateOtp();

    console.log("Updating OTP in DB...", otp);
    await trainerRepo.updateOtp(trainer.email, otp);

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "FitHub OTP Verification",
        text: `Your OTP is ${otp}. It expires in 30 seconds.`,
      });
      console.log("OTP email sent to trainer email");
    } catch (emailError) {
      console.error("Email send failed:-trainer", emailError);
      console.log(`OTP for ${email}: ${otp}`);
    }

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Trainer login error:", error);
    res.status(401).json({ message: (error as Error).message });
  }
};

export const verifyTrainerOtp = async (req: Request, res: Response) => {
  console.log("Verify OTP route called-trainer");
  try {
    const { email, otp } = req.body;
    console.log("Verify OTP:", { email, otp });

    const trainer = await trainerRepo.findByEmail(email);
    if (!trainer) {
      res.status(400).json({ message: "Trainer not found" });
      return;
    }

    if (trainer.otp !== otp) {
      res.status(400).json({ message: "Invalid OTP" });
      return;
    }
    if (!trainer.otpExpires || Date.now() > trainer.otpExpires.getTime()) {
      res.status(400).json({ message: "OTP expired" });
      return;
    }

    await trainerRepo.verifyUser(email);
    console.log("Trainer verified:", email);

    const accessToken = generateAccessToken({ email: trainer.email, id: trainer.id });
    const refreshToken = generateRefreshToken({ email: trainer.email, id: trainer.id });
    await trainerRepo.updateRefreshToken(email, refreshToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
      sameSite: "lax",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    console.log("Trainer successfully logged in");
    res.json({ user: { id: trainer.id, email: trainer.email, name: trainer.name, role: trainer.role } });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(400).json({ message: (error as Error).message });
  }
};

export const trainerLogout = async (req: Request, res: Response) => {
  console.log("Trainer logout route called");
  try {
    const email = req.trainer?.email;
    if (!email) {
      res.status(400).json({ message: "Trainer email not found" });
      return;
    }
    await trainerRepo.updateRefreshToken(email, null); // Clear refresh token
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.status(200).json({ message: "Trainer logged out successfully" });
  } catch (error) {
    console.error("Trainer logout error:", error);
    res.status(500).json({ message: (error as Error).message });
  }
};


export const resendTrainerOtp = async (req: Request, res: Response) => {
  console.log("Resend Trainer OTP route called");
  try {
    const { email } = req.body;
    console.log("Resend OTP for trainer:", email);

    const trainer = await trainerRepo.findByEmail(email);
    if (!trainer) {
      res.status(400).json({ message: "Trainer not found" });
      return;
    }

    const otp = generateOtp();
    console.log("Generating new OTP for trainer...", otp);
    await trainerRepo.updateOtp(email, otp);

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "FitHub Trainer OTP Verification",
        text: `Your new OTP is ${otp}. It expires in 30 seconds.`,
      });
      console.log("New OTP email sent to trainer", otp);
    } catch (emailError) {
      console.error("Email send failed for trainer:", emailError);
      console.log(`New OTP for trainer ${email}: ${otp}`);
    }

    res.status(200).json({ message: "New OTP sent to your email" });
  } catch (error) {
    console.error("Resend Trainer OTP error:", error);
    res.status(400).json({ message: (error as Error).message });
  }
};