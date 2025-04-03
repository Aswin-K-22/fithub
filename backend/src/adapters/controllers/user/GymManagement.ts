// backend/src/adapters/controllers/user/GymManagement.ts
import { Request, Response } from "express";
import { MongoGymRepository } from "../../gymRepository";
import { GymForUsers } from "../../../entities/gym";


const gymRepository = new MongoGymRepository();

export const getGymsForUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 3;
    const search = req.query.search as string | undefined;
    const location = req.query.location as string | undefined;
    const gymType = req.query.gymType as string | undefined;
    const rating = req.query.rating as string | undefined;

    const filters = { search, location, gymType, rating };
    const skip = (page - 1) * limit;

    const gyms: GymForUsers[] = await gymRepository.findAllForUsers(skip, limit, filters);
    const totalGyms = await gymRepository.countWithFilters(filters);
    const totalPages = Math.ceil(totalGyms / limit);

    res.status(200).json({
      success: true,
      gyms,
      page,
      totalPages,
      totalGyms,
    });
  } catch (error) {
    console.error("Error fetching gyms:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};