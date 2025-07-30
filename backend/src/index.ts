import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";

dotenv.config(); // Loads env vars from .env file
const app = express(); // Initializes Express Server

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
); // Enables CORS (frontend ↔ backend)

app.use(express.json()); // parses incoming JSON payloads

app.use(cookieParser());

// App routes
app.use("/auth", authRoutes); // mounts /signup and /login under /auth

// Health Checks
app.get("/", (_, res) => res.send("Backup is Up ✅"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running of localhost ${PORT}`));
