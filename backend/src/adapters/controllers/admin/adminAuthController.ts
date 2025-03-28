import { Request, Response } from "express";
import { MongoUserRepository } from "../../userRepository";
import { AuthenticateAdmin } from "../../../use-cases/authenticateAdmin"; 
import * as jwt from "jsonwebtoken";

const userRepo = new MongoUserRepository();
const authAdmin = new AuthenticateAdmin(userRepo); 
console.log("AuthAdmin created");


const generateAccessToken = (user: { email: string; id: string }) => {
    return jwt.sign({ email: user.email, id: user.id }, process.env.JWT_ACCESS_SECRET || "access_secret", { expiresIn: "15m" });
  };
  
  const generateRefreshToken = (user: { email: string; id: string }) => {
    return jwt.sign({ email: user.email, id: user.id }, process.env.JWT_REFRESH_SECRET || "refresh_secret", { expiresIn: "7d" });
  };



export const adminLogin = async (req: Request, res: Response) => {
    try {
      console.log('admin trying to login');
      
      const { email, password } = req.body;
      const{ user } = await authAdmin.execute(email, password); 
  
      const accessToken = generateAccessToken({ email: user.email, id: user.id });
      const refreshToken = generateRefreshToken({ email: user.email, id: user.id });
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
  
      console.log("Admin successfully logged in");
      res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(401).json({ message: (error as Error).message });
    }
  };

