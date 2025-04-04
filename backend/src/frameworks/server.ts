// backend/src/frameworks/server.ts
import express from "express";
import type { Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import morgan from "morgan";
import { signup, login, verifyOtp, logout, refreshToken, resendOtp, getUser, googleAuth, forgotPassword, resetPassword, verifyForgotPasswordOtp } from "../adapters/controllers/user/authController";
import cookieParser from "cookie-parser";
import { authMiddleware } from "../adapters/middleware/authMiddleware";
import { adminLogin } from "../adapters/controllers/admin/adminAuthController";
import { getTrainer, resendTrainerOtp, trainerLogin, trainerLogout, verifyTrainerOtp } from "../adapters/controllers/trainer/trainerAuthController";
import { getAllUsers, toggleUserVerification } from "../adapters/controllers/admin/userManagement";
import { adminAuthMiddleware } from "../adapters/middleware/adminAuthMiddleware";
import { addTrainer, getAvailableTrainers, getTrainers } from "../adapters/controllers/admin/TrainerManagement";
import { trainerAuthMiddleware } from "../adapters/middleware/trainerAuthMidd";
import { addGym, getGyms } from "../adapters/controllers/admin/gymManagement";
import { upload } from "../adapters/config/multer";
import { getGymsForUsers } from "../adapters/controllers/user/GymManagement";
import { getUserProfile, updateUserProfile } from "../adapters/controllers/user/profileController";
import { getTrainerProfile, updateTrainerProfile } from "../adapters/controllers/trainer/trainerProfileController";
import { addMembershipPlan, getMembershipPlans } from "../adapters/controllers/admin/membershipController";
import { getMembershipPlansForUsers } from "../adapters/controllers/user/membershipController";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.use(morgan("[:date[iso]] :method :url :status :response-time ms"));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(cookieParser());
app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ extended: true, limit: "10mb" })); 
app.use("/uploads", express.static("uploads"));

// Routes
app.get("/api/user/gyms", getGymsForUsers);
app.put("/api/auth/user/profile", authMiddleware, upload.single("profilePic"), updateUserProfile);
app.get("/api/auth/user/profile", authMiddleware, getUserProfile);

app.get("/api/user/membership-plans", getMembershipPlansForUsers);

// Routes (without authentication)
app.post("/api/auth/signup", signup);
app.post("/api/auth/login", login);
app.post("/api/auth/verify-otp", verifyOtp);
app.post("/api/auth/google", googleAuth);
app.post("/api/auth/resend-otp", resendOtp);
app.post("/api/auth/forgot-password", forgotPassword);
app.post("/api/auth/verify-forgot-password-otp", verifyForgotPasswordOtp);
app.post("/api/auth/reset-password", resetPassword);

// Admin Routes
app.post("/api/auth/admin/login", adminLogin);
app.get("/api/admin/users", adminAuthMiddleware, getAllUsers);
app.post("/api/admin/addTrainer", adminAuthMiddleware, addTrainer);
app.post("/api/admin/addGym", upload.array("images"), adminAuthMiddleware, addGym);
app.get("/api/admin/available-trainers", adminAuthMiddleware, getAvailableTrainers);
app.get("/api/admin/gyms", adminAuthMiddleware, getGyms);
app.get("/api/admin/trainers", adminAuthMiddleware, getTrainers);
app.put("/api/admin/users/:id/toggle-verification", adminAuthMiddleware, toggleUserVerification);

app.post("/api/admin/membership-plans", adminAuthMiddleware, addMembershipPlan);
app.get("/api/admin/membership-plans", adminAuthMiddleware, getMembershipPlans);


// Trainer Routes
app.post("/api/auth/trainer/login", trainerLogin);
app.post("/api/auth/trainer/verify-otp", verifyTrainerOtp);
app.post("/api/auth/trainer/logout", trainerLogout);
app.post("/api/auth/trainer/resend-otp", resendTrainerOtp);
app.get("/api/trainer/profile", trainerAuthMiddleware, getTrainerProfile);
app.put("/api/trainer/profile", trainerAuthMiddleware, upload.single("profilePic"), updateTrainerProfile);

// Protected Routes (require auth)
app.post("/api/auth/logout", authMiddleware, logout);
app.post("/api/auth/refresh-token", refreshToken);
app.get("/api/auth/user", authMiddleware, getUser);
app.get("/api/auth/user-trainer", trainerAuthMiddleware, getTrainer);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Global error:", err.stack);
  res.status(500).json({ message: "Something went wrong on the server", error: err.message });
  next();
});

io.on("connection", (socket) => {
  console.log("User connected");
});

export { httpServer };