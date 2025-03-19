import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { MongoUserRepository } from "../userRepository";

const userRepo = new MongoUserRepository();


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies?.accessToken;
      if (!accessToken) {
        res.status(401).json({ message: "No access token provided" });
        return 
      
    }
  
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET || "access_secret") as {
        email: string;
        id: string;
      };
  
      const user = await userRepo.findByEmail(decoded.email);
      if (!user) {
        res.status(401).json({ message: "User not found" });
        return 
      
    }
  
      req.user  = { id: user.id, email: user.email };
      next();
    } catch (error) {
      console.error("Auth middleware error:", error);
       res.status(401).json({ message: "Invalid or expired access token" });
       return 
    
    }
  };

  declare module "express" {
    interface Request {
      user?: { id: string; email: string };
    }
  }