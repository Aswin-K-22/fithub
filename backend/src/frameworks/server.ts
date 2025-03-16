import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { MongoUserRepository } from "../adapters/userRepository";
import { AuthenticateUser } from "../use-cases/authenticateUser";
import { RegisterUser } from "../use-cases/registerUser";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.json());
app.use(cors({origin : process.env.FRONT_END_URL}));

const userRepo = new MongoUserRepository();
const authUser = new AuthenticateUser(userRepo);
const registerUser = new RegisterUser(userRepo);

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await registerUser.execute(name, email, password);
    res.status(200).json({ message: "Signup successful—OTP step pending" });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

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