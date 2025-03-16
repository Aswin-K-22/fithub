import { Request, Response } from "express";
import { MongoUserRepository } from "../userRepository";
import { AuthenticateUser } from "../../use-cases/authenticateUser";
import { RegisterUser } from "../../use-cases/registerUser";
import nodemailer from "nodemailer";

const userRepo = new MongoUserRepository();
const authUser = new AuthenticateUser(userRepo);
const registerUser = new RegisterUser(userRepo);

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();


  export const signup = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;
      const user = await registerUser.execute(name, email, password);
      const otp = generateOtp();
  
      await userRepo.updateOtp(user.email, otp); 
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "FitHub OTP Verification",
        text: `Your OTP is ${otp}. It expires in 10 minutes.`,
      });
  
      res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  };

  export const login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const { token, user } = await authUser.execute(email, password);
      res.json({ token, user });
    } catch (error) {
      res.status(401).json({ message: (error as Error).message });
    }
  };