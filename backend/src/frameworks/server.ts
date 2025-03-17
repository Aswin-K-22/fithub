import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import morgan from "morgan";
import { signup, login  , verifyOtp ,logout, refreshToken ,resendOtp} from "../adapters/controllers/authController";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(morgan("[:date[iso]] :method :url :status :response-time ms"));



app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));



app.use(express.json());


// Routes
app.post("/api/auth/signup", signup);
app.post("/api/auth/login", login);
app.post('/api/auth/verify-otp' ,verifyOtp)
app.post("/api/auth/logout", logout);
app.post("/api/auth/refresh-token", refreshToken);
app.post("/api/auth/resend-otp", resendOtp);
  io.on("connection", (socket) => {
    console.log("User connected");
  });
  
  export { httpServer };