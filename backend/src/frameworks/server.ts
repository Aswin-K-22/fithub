import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { MongoUserRepository } from "../adapters/userRepository";
import { AuthenticateUser } from "../use-cases/authenticateUser";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.json());
app.use(cors({origin : "http://localhost:5173"}));

const userRepo = new MongoUserRepository();
const authUser = new AuthenticateUser(userRepo);

app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const { token, user } = await authUser.execute(email, password);
      res.json({ token, user });
    } catch (error) {
      res.status(401).json({ message: (error as Error).message });
    }
  });
  
  io.on("connection", (socket) => {
    console.log("User connected");
  });
  
  export { httpServer };