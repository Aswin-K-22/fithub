import express, { NextFunction, Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import morgan from "morgan";
import { signup, login  , verifyOtp ,logout, refreshToken ,resendOtp , getUser ,googleAuth} from "../adapters/controllers/authController";
import cookieParser from 'cookie-parser'
import { authMiddleware } from "../adapters/middleware/authMiddleware";
import { adminLogin } from "../adapters/controllers/admin/adminAuthController";
import { trainerLogin } from "../adapters/controllers/trainer/trainerAuthController";


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer ,{
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.use(morgan("[:date[iso]] :method :url :status :response-time ms"));



app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));


app.use(cookieParser())
app.use(express.json());


// Routes


// Routes (without authentication)
app.post("/api/auth/signup", signup);
app.post("/api/auth/login", login);
app.post("/api/auth/verify-otp", verifyOtp);
app.post("/api/auth/google", googleAuth);
app.post("/api/auth/resend-otp", resendOtp);


// Admin Routes

app.post("/api/auth/admin/login", adminLogin);


//Trainer routes

app.post("/api/trainer/login", trainerLogin);


// Protected Routes (require auth)
app.post("/api/auth/logout", authMiddleware, logout);
app.post("/api/auth/refresh-token", authMiddleware, refreshToken); 
app.get("/api/auth/user", authMiddleware, getUser);


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Global error:", err.stack);
  res.status(500).json({ message: "Something went wrong on the server", error: err.message });
  next();
});


  io.on("connection", (socket) => {
    console.log("User connected");
  });
  
  export { httpServer };