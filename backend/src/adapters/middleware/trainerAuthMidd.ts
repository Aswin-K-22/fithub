import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { MongoTrainerRepository } from "../trainerRepository";

const trainerRepo = new MongoTrainerRepository();

export const trainerAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies?.accessToken;
    if (!accessToken) {
      res.status(401).json({ message: "No access token provided" });
      return;
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET || "access_secret") as {
      email: string;
      id: string;
    };

    const trainer = await trainerRepo.findById(decoded.id);
    if (!trainer) {
      res.status(401).json({ message: "Trainer not found" });
      return;
    }

    req.trainer = { id: trainer.id, email: trainer.email };
    next();
  } catch (error) {
    console.error("Trainer auth middleware error:", error);
    res.status(401).json({ message: "Invalid or expired access token" });
    return;
  }
};

declare module "express" {
  interface Request {
    trainer?: { id: string; email: string };
  }
}