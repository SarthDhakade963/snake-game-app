import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";

dotenv.config(); // Loads env vars from .env file
const app = express(); // Initializes Express Server

app.use(cookieParser());
const FRONTEND_ORIGIN = process.env.FRONTEND_URL || "http://localhost:3000";
app.use(
  cors({
    origin: FRONTEND_ORIGIN, //frontend origin
    credentials: true, // allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
); // Enables CORS (frontend ↔ backend)

app.use(express.json()); // parses incoming JSON payloads

// App routes
app.use("/auth", authRoutes); // mounts /signup and /login under /auth

// Health Checks
app.get("/", (_, res) => res.send("Backup is Up ✅"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running of localhost ${PORT}`));

// running on mobile or any device (condition to be on same network)
// app.listen(5000, "0.0.0.0", () => {
//   console.log(`Server running on http://192.168.31.219:5000`);
// });
