import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { signup, login } from "../adapters/controllers/authController";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use((req,res,next)=>{
  const time = new Date().toISOString();
  console.log(`[${time}] : ${req.method} ${ req.path}`)
})
app.use(express.json());
app.use(cors({
  origin : "http://localhost:5173",
  credentials : true,
}));

// Routes
app.post("/api/auth/signup", signup);
app.post("/api/auth/login", login);


  io.on("connection", (socket) => {
    console.log("User connected");
  });
  
  export { httpServer };