// adapters/controllers/admin/gymManagement.ts
import { Request, Response } from "express";
import { MongoGymRepository } from "../../gymRepository";
import { MongoTrainerRepository } from "../../trainerRepository";
import { Prisma } from "@prisma/client";
import { AddGym } from "../../../entities/gym";
import { MulterError } from "multer";

const gymRepository = new MongoGymRepository();
const trainerRepository = new MongoTrainerRepository();

// Define membership compatibility based on gym type
const getMembershipCompatibility = (gymType: string): string[] => {
  switch (gymType.toLowerCase()) {
    case "basic":
      return ["Basic", "Premium", "Diamond"]; // All tiers can use Basic gyms
    case "premium":
      return ["Premium", "Diamond"]; // Premium and Diamond can use Premium gyms
    case "diamond":
      return ["Diamond"]; // Only Diamond can use Diamond gyms
    default:
      return ["Basic"]; // Fallback for unknown types
  }
};

export const addGym = async (req: Request, res: Response) => {
  try {
    console.log("Received request to add gym:", req.body);

    if (!req.body.gymData) {
      console.log("Validation Failed: Missing gymData");
      return res.status(400).json({ success: false, message: "Gym data is required" });
    }

    const gymData: AddGym = JSON.parse(req.body.gymData);
    console.log("Parsed gymData:", gymData);

    const imageFiles = req.files as Express.Multer.File[] | undefined;
    console.log("Uploaded image files:", imageFiles?.map((f) => f.filename));

    const requiredFields: (keyof AddGym)[] = ["name", "type", "address", "contact", "schedule", "maxCapacity"];
    const missingFields = requiredFields.filter((field) => !gymData[field]);
    if (missingFields.length > 0) {
      console.log("Validation Failed: Missing fields:", missingFields);
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    console.log("All required fields are present.");

    if (!gymData.address || !gymData.contact || !gymData.schedule?.length) {
      console.log("Validation Failed: Address, contact, or schedule missing");
      return res.status(400).json({
        success: false,
        message: "Address, contact, and at least one schedule entry are required",
      });
    }

    console.log("Checking for duplicate gym name:", gymData.name);
    const existingGym = await gymRepository.findByName(gymData.name);
    if (existingGym) {
      console.log("Validation Failed: Duplicate gym found", existingGym);
      return res.status(409).json({
        success: false,
        message: "A gym with this name already exists",
      });
    }

    console.log("Gym name is unique.");

    const imageUrls = imageFiles?.map((file) => `/uploads/${file.filename}`) || [];
    if (!imageFiles || imageFiles.length === 0) {
      console.log("Validation Failed: No image files uploaded");
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    console.log("Image processing complete:", imageUrls);

    if (gymData.trainers && gymData.trainers.length > 0) {
      const trainerIds = gymData.trainers.map((t) => t.trainerId);
      console.log("Checking trainer availability for trainers:", trainerIds);
      const availabilityCheck = await trainerRepository.checkTrainerAvailability(trainerIds);
      if (!availabilityCheck.isValid) {
        console.log("Validation Failed: Trainer availability issue", availabilityCheck.message);
        return res.status(400).json({
          success: false,
          message: availabilityCheck.message,
        });
      }
    }

    console.log("Trainer availability check passed.");

    const gymToCreate: Prisma.GymCreateInput = {
      name: gymData.name,
      type: gymData.type,
      description: gymData.description,
      address: {
        street: gymData.address.street,
        city: gymData.address.city,
        state: gymData.address.state,
        postalCode: gymData.address.postalCode,
        lat: parseFloat(gymData.address.lat),
        lng: parseFloat(gymData.address.lng),
      },
      contact: gymData.contact,
      equipment: gymData.equipment || [],
      schedule: gymData.schedule.map((s) => ({
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
        isClosed: s.isClosed,
        slotDuration: s.slotDuration,
        slotCapacity: s.slotCapacity,
      })),
      maxCapacity: gymData.maxCapacity,
      trainers: gymData.trainers || [],
      facilities: gymData.facilities
        ? {
            hasPool: gymData.facilities.includes("Pool"),
            hasSauna: gymData.facilities.includes("Sauna"),
            hasParking: gymData.facilities.includes("Parking"),
            hasLockerRooms: gymData.facilities.includes("Lockers"),
            hasWifi: gymData.facilities.includes("Wifi"),
            hasShowers: gymData.facilities.includes("Showers"),
          }
        : undefined,
      images: imageUrls.map((url) => ({ url, uploadedAt: new Date() })),
      membershipCompatibility: getMembershipCompatibility(gymData.type), // Dynamic assignment
    };

    console.log("Final gym object to be created:", JSON.stringify(gymToCreate, null, 2));

    const createdGym = await gymRepository.create(gymToCreate);
    console.log("Gym created successfully:", createdGym);

    if (gymData.trainers && gymData.trainers.length > 0) {
      const trainerIds = gymData.trainers.map((t) => t.trainerId);
      console.log("Assigning trainers to gym:", trainerIds);
      await trainerRepository.assignTrainersToGym(trainerIds, createdGym.id);
    }

    console.log("Trainers assigned successfully.");

    res.status(201).json({
      success: true,
      gym: createdGym,
      message: "Gym created successfully",
    });
  } catch (error) {
    console.error("Error creating gym:", error);
    if (error instanceof MulterError) {
      return res.status(400).json({
        success: false,
        message: `Multer error: ${error.message}`,
        error: error.code,
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error while creating gym",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};



export const getGyms = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 2; // Default to 2 per page
      const skip = (page - 1) * limit;
  
      const gyms = await gymRepository.findAll(skip, limit); // Assume this method exists
      const totalGyms = await gymRepository.count(); // Assume this method exists
  
      res.status(200).json({
        success: true,
        gyms,
        total: totalGyms,
        page,
        totalPages: Math.ceil(totalGyms / limit),
      });
    } catch (error) {
      console.error("Error fetching gyms:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while fetching gyms",
      });
    }
  };

