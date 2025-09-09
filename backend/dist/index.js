"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const score_1 = __importDefault(require("./routes/score"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config(); // Loads env vars from .env file
const app = (0, express_1.default)(); // Initializes Express Server
app.use((0, cookie_parser_1.default)());
const FRONTEND_ORIGIN = process.env.FRONTEND_URL || "http://localhost:3000";
app.use((0, cors_1.default)({
    origin: FRONTEND_ORIGIN, //frontend origin
    credentials: true, // allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
})); // Enables CORS (frontend ↔ backend)
app.use(express_1.default.json()); // parses incoming JSON payloads
// App routes
app.use("/auth", auth_1.default); // mounts /signup and /login under /auth
// Score routes
app.use("/score", score_1.default);
// Health Checks
app.get("/", (_, res) => res.send("Backup is Up ✅"));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running of localhost ${PORT}`));
// running on mobile or any device (condition to be on same network)
// app.listen(5000, "0.0.0.0", () => {
//   console.log(`Server running on http://192.168.31.219:5000`);
// });
