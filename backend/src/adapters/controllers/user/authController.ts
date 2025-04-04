import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { MongoUserRepository } from "../../userRepository";
import { MongoTrainerRepository } from "../../trainerRepository";
import { generateAccessToken, generateRefreshToken } from "../../config/tokens";
import { OAuth2Client, LoginTicket } from "google-auth-library";
import { AuthenticateUser } from "../../../use-cases/authenticateUser";
import { RegisterUser } from "../../../use-cases/registerUser";
import { transporter } from "../../config/emailConfig";
import { generateOtp } from "../../config/otpGenerate";

// Extend Express Request type
declare module "express" {
  interface Request {
    user?: { id: string; email: string };
  }
}

interface AuthEntity {
  id: string;
  email: string;
  name: string | null; 
  role: string;
  refreshToken: string | null;
}

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_CALLBACK_URL,
});

const userRepo = new MongoUserRepository();
const trainerRepo = new MongoTrainerRepository();
const authUser = new AuthenticateUser(userRepo);
const registerUser = new RegisterUser(userRepo);




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
      secure: process.env.NODE_ENV === "production", 
      maxAge: 15 * 60 * 1000,
     
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      
    });

    res.status(200).json({message: "Signup completed", user: {  id : pendingUser.id , email:  pendingUser.email, name: pendingUser.name  , role : pendingUser.role} });


    } catch (error) {
      console.error("Verify OTP error:", error);
      res.status(400).json({ message: (error as Error).message });
    }
  };
  



  export const login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const {  user } = await authUser.execute(email, password);
      const refreshToken = generateRefreshToken({ email: user.email, id: user.id });
      const accessToken = generateAccessToken({email: user.email, id: user.id});
      await userRepo.updateRefreshToken(email, refreshToken);
  
      

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
  
      console.log("Successfully logged in");
      res.json({ user: {  id : user.id ,email: user.email, name: user.name ,role :user.role } });
    } catch (error) {
      res.status(401).json({ message: (error as Error).message });
    }
  };

  //logout

  export const logout = async (req: Request, res: Response) => {
    console.log("Logout route called");
    try {
      const email = req.user?.email; 
      if (!email) {
          res.status(400).json({ message: "User email not found" });
          return 
        }
      await userRepo.updateRefreshToken(email, null);
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ message: (error as Error).message });
    }
  };


  //refresh token
  export const refreshToken = async (req: Request, res: Response) => {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        res.status(401).json({ message: "No refresh token provided" });
        return;
      }
  
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "refresh_secret") as { email: string; id: string };
      if (!decoded.email) {
        res.status(401).json({ message: "Invalid refresh token structure" });
        return;
      }
  
      let entity: AuthEntity | null = await userRepo.findById(decoded.id);
      let repo: MongoUserRepository | MongoTrainerRepository = userRepo;
  
      if (!entity) {
        const trainer = await trainerRepo.findById(decoded.id);
        if (trainer) {
          entity = {
            id: trainer.id,
            email: trainer.email,
            name: trainer.name,
            role: trainer.role || "trainer",
            refreshToken: trainer.refreshToken || null,
          };
          repo = trainerRepo;
        }
      }
  
      if (!entity) {
        res.status(401).json({ message: "Entity not found" });
        return;
      }
  
      if (entity.refreshToken !== refreshToken) {
        res.status(401).json({ message: "Invalid refresh token" });
        return;
      }
  
      const newAccessToken = generateAccessToken({ email: entity.email, id: entity.id });
      const newRefreshToken = generateRefreshToken({ email: entity.email, id: entity.id });
      await repo.updateRefreshToken(entity.email, newRefreshToken);
  
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000,
        sameSite: "lax",
      });
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "lax",
      });
  
      console.log("New tokens set:", { newAccessToken, newRefreshToken });
      res.status(200).json({ user: { id: entity.id, email: entity.email, name: entity.name, role: entity.role } });
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



  export const getUser = async (req: Request, res: Response) => {
    try {
      const email = req.user?.email;
      if (!email) {
         res.status(401).json({ message: "User not authenticated" });
         return 
        }
      const user = await userRepo.findByEmail(email);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return 
      }
      res.status(200).json({ user: { id: user.id, email: user.email, name: user.name ,role :user.role } });
    } catch (error) {
      console.error("Get me error:", error);
      res.status(500).json({ message: "Invalid token" });
    }
  }

  export const googleAuth = async (req: Request, res: Response) => {
    try {
      const { code } = req.body;
      if (!code) {
        res.status(400).json({ message: "No authorization code provided" });
        return;
      }
  
      const { tokens } = await client.getToken({
        code,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL, 
      });
      console.log("Tokens received from Google:", tokens);
  
      if (!tokens.id_token) {
        throw new Error("No ID token received from Google");
      }

      console.log("GOOGLE_CLIENT_ID from env:", process.env.GOOGLE_CLIENT_ID);
      const ticket : LoginTicket= await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID, 
      });
  
      const payload = ticket.getPayload();
      console.log("Token payload:", payload); 
      if (!payload || !payload.email) {
        res.status(400).json({ message: "Invalid Google token: Email is missing" });
        return;
      }
  
      let user = await userRepo.findByEmail(payload.email);
      if (!user) {
        user = await registerUser.execute(payload.name || "Google User", payload.email, "" ,true);
      }
  
      const accessToken = generateAccessToken({ email: user.email, id: user.id });
      const refreshToken = generateRefreshToken({ email: user.email, id: user.id });
      await userRepo.updateRefreshToken(user.email, refreshToken);
  
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
  
      res.status(200).json({ user: { id: user.id, email: user.email, name: user.name ,role :user.role} });
    } catch (error) {
      console.error("Google Auth Error:", error);
      res.status(500).json({ message: "Google authentication failed" });
    }
  };


  export const forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
  
      console.log("Forgot password request received for:", email);
  
      // Fetch user
      const user = await userRepo.findByEmail(email);
      if (!user) {
        console.log("User not found:", email);
        return res.status(404).json({ message: "User not found" });
      }

      if (!user.isVerified) {
        console.log("User email not verified:", email);
        return res.status(400).json({ message: "User email not verified" });
      }
  
      // Generate OTP
      const otp = generateOtp();
      console.log(`Generated OTP for ${email}:`, otp);
  
      // Store OTP in DB
      await userRepo.updateOtp(email, otp);
  
      // Send OTP Email
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: "FitHub Password Reset OTP",
          text: `Your OTP to reset your password is ${otp}. It expires in 5 minutes.`,
        });
        console.log("OTP email sent successfully to:", email);
        res.status(200).json({ message: "OTP sent to your email" });
      } catch (emailError) {
        console.error("Email send failed:", emailError);
        res.status(500).json({ message: "Failed to send OTP. Try again later." });
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

  export const verifyForgotPasswordOtp = async (req: Request, res: Response) => {
    try {
      const { email, otp } = req.body;
      console.log("Verify Forgot Password OTP:", { email, otp });
  
      const user = await userRepo.findByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (user.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }
      if (!user.otpExpires || Date.now() > user.otpExpires.getTime()) {
        return res.status(400).json({ message: "OTP expired" });
      }
  
      res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
      console.error("Verify forgot password OTP error:", error);
      res.status(400).json({ message: (error as Error).message });
    }
  };


  
  export const resetPassword = async (req: Request, res: Response) => {
    try {
      console.log("Incoming request:", req.body);
  
      const { email, otp, newPassword } = req.body;
      if (!email || !otp || !newPassword) {
        console.log("Missing required fields:", { email, otp, newPassword });
        return res.status(400).json({ message: "All fields are required" });
      }
  
      console.log("Fetching user by email:", email);
      const user = await userRepo.findByEmail(email);
  
      if (!user) {
        console.log("User not found for email:", email);
        return res.status(404).json({ message: "User not found" });
      }
  
      console.log("User found:", user);
  
      // if (user.otp !== otp) {
      //   console.log("Invalid OTP:", { provided: otp, expected: user.otp });
      //   return res.status(400).json({ message: "Invalid OTP" });
      // }
  
      // if (!user.otpExpires || Date.now() > user.otpExpires.getTime()) {
      //   console.log("OTP expired:", {
      //     otpExpires: user.otpExpires,
      //     currentTime: new Date(),
      //   });
      //   return res.status(400).json({ message: "OTP expired" });
      // }
  
      console.log("Updating password for user:", email);
      await userRepo.updatePassword(email, newPassword);
  
      console.log("Password reset successful for:", email);
      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  


