import { Request, RequestHandler, Response } from "express";
import { MongoUserRepository } from "../userRepository";
import { AuthenticateUser } from "../../use-cases/authenticateUser";
import { RegisterUser } from "../../use-cases/registerUser";
import nodemailer from "nodemailer";
import * as jwt from "jsonwebtoken";



console.log("Initializing controllers...");
const userRepo = new MongoUserRepository();
console.log("UserRepo created");
const authUser = new AuthenticateUser(userRepo);
console.log("AuthUser created");
const registerUser = new RegisterUser(userRepo);
console.log("RegisterUser created");




const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });


  const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();



  const generateAccessToken = (user: { email: string; id: string }) => {
    return jwt.sign({ email: user.email, id: user.id }, process.env.JWT_SECRET || "secret", { expiresIn: "15m" });
  };


  const generateRefreshToken = (user: { email: string; id: string }) => {
    return jwt.sign({ email: user.email, id: user.id }, process.env.JWT_REFRESH_SECRET || "refresh_secret", { expiresIn: "7d" });
  };


  export const signup = async (req: Request, res: Response) => {
    try {


      const { name, email, password } = req.body;
      console.log("Fields extracted:", { name, email, password });
      const existingUser = await userRepo.findByEmail(email);
    if (existingUser) {
      
         res.status(400).json({ message: "Email already exists and is verified" });
         return
        }

      const user = await registerUser.execute(name, email, password);
      const otp = generateOtp();


      console.log("Updating OTP in DB..." ,otp);
      await userRepo.updateOtp(user.email, otp); 

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: "FitHub OTP Verification",
          text: `Your OTP is ${otp}. It expires in 30 seconds.`,
        });
        console.log("OTP email sent");
      } catch (emailError) {
        console.error("Email send failed:", emailError);
        console.log(`OTP for ${email}: ${otp}`);
      }
  
      res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(400).json({ message: (error as Error).message });
    }
  };


  export const verifyOtp  = async (req: Request, res: Response) => {
    console.log("Verify OTP route called");
    try {
      const { email, otp } = req.body;
      console.log("Verify OTP:", { email, otp });
  
      const pendingUser = await userRepo.findByEmail(email);
      if (!pendingUser) {
         res.status(400).json({ message: "User not found" });
         return
        }
      if (pendingUser.isVerified) {
        res.status(400).json({ message: "User already verified" });
        return 
        
      }
      if (pendingUser.otp !== otp) {
        res.status(400).json({ message: "Invalid OTP" });
        return 
        
      }
      if (!pendingUser.otpExpires || Date.now() > pendingUser.otpExpires.getTime()) {
      
        res.status(400).json({ message: "OTP expired" });
        return 
        
      }
  
      await userRepo.verifyUser(email);
      console.log("User verified:", email);
  
      const accessToken = generateAccessToken({ email: pendingUser.email, id: pendingUser.id });
    const refreshToken = generateRefreshToken({ email: pendingUser.email, id: pendingUser.id });
    await userRepo.updateRefreshToken(email, refreshToken);

   res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure in production
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Signup completed",
      email: pendingUser.email,
      name: pendingUser.name,
      accessToken, // Optional: Send in body too if frontend needs it
    });


    } catch (error) {
      console.error("Verify OTP error:", error);
      res.status(400).json({ message: (error as Error).message });
    }
  };



  export const login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const { token: accessToken, user } = await authUser.execute(email, password);
      // CHANGE: Add refresh token
      const refreshToken = generateRefreshToken({ email: user.email, id: user.id });
      await userRepo.updateRefreshToken(email, refreshToken);
  
      // CHANGE: Set cookies
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
  
      console.log("Successfully logged in");
      res.json({ accessToken, user });
    } catch (error) {
      res.status(401).json({ message: (error as Error).message });
    }
  };

  export const logout = async (req: Request, res: Response) => {
    console.log("Logout route called");
    try {
      // CHANGE: Clear refresh token in DB and cookies
      const email = req.body.email; // Assume frontend sends email
      if (email) await userRepo.updateRefreshToken(email, null);
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ message: (error as Error).message });
    }
  };

  export const refreshToken = async (req: Request, res: Response) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        
        res.status(401).json({ message: "No refresh token provided" });
        return 
      }
  
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "refresh_secret") as { email: string; id: string };
      const user = await userRepo.findByEmail(decoded.email);
      if (!user || user.refreshToken !== refreshToken) {
        
        res.status(401).json({ message: "Invalid refresh token" });
        return 
      }
  
      const newAccessToken = generateAccessToken({ email: user.email, id: user.id });
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000,
      });
  
      res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      console.error("Refresh token error:", error);
      res.status(401).json({ message: "Invalid refresh token" });
    }
  };


  export const resendOtp = async (req: Request, res: Response) => {
    console.log("Resend OTP route called");
    try {
      const { email } = req.body;
      console.log("Resend OTP for:", email);
  
      const user = await userRepo.findByEmail(email);
      if (!user) {
        res.status(400).json({ message: "User not found" });
        return 
      }

  
      const otp = generateOtp();
      console.log("Generating new OTP...");
      await userRepo.updateOtp(email, otp);
  
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: "FitHub OTP Verification",
          text: `Your new OTP is ${otp}. It expires in 30 seconds.`,
        });
        console.log("New OTP email sent",otp);
      } catch (emailError) {
        console.error("Email send failed:", emailError);
        console.log(`New OTP for ${email}: ${otp}`);
      }
  
      res.status(200).json({ message: "New OTP sent to your email" });
    } catch (error) {
      console.error("Resend OTP error:", error);
      res.status(400).json({ message: (error as Error).message });
    }
  };

