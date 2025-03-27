import { Request, Response } from "express";
import { MongoUserRepository } from "../../userRepository";

const userRepository = new MongoUserRepository();

export const getAllUsers = async (req: Request, res: Response) : Promise<void>=> {
  try {
    console.log('data fetching ');
    
    const users = await userRepository.findAllUsers();
    
    
    if (!users) {
       res.status(500).json({ message: "Failed to fetch users" });
       return
    }
    console.log('first data', users[0]);
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};