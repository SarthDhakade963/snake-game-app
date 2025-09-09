"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../middleware/auth");
const auth_2 = require("../lib/auth");
const router = express_1.default.Router(); // create the constructor of roter
const JWT_SECRET = (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : "";
// if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");
// sign up router
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // during signup client sends the username, email and password
    const { username, email, password } = req.body;
    try {
        // checks if the user input username is unique
        const userNameExists = yield (0, auth_2.usernameExists)(username);
        // if username exists then send Bad Request status (400)
        if (userNameExists)
            return res.status(400).json({ error: "Router error: Username already exists" });
        // if user with email exists then send Bad Request status (400)
        const userExists = yield (0, auth_2.userEmailExists)(email);
        // if user with email exists then send Bad Request status (400)
        if (userExists)
            return res.status(400).json({ error: "Router error: User already exists" });
        // bcrypt the password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // store the user info in DB
        const user = yield (0, auth_2.createUser)(username, email, hashedPassword);
        // 🔸 jwt.sign(payload, secret) : Creates a JWT token
        // payload : The data you want to include inside the token.
        // JWT_SECRET: This is the secret key used to digitally sign the token
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET);
        res
            .cookie("auth_token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false, // for testing //process.env.NODE_ENV === "production"
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
            .json({ message: "Authenticated" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Router error: Something went wrong during Signup" });
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield (0, auth_2.userEmailExists)(email);
        if (!user)
            return res.status(404).json({ error: "Router error: User not found" });
        const valid = yield bcrypt_1.default.compare(password, user.password);
        if (!valid)
            return res.status(401).json({ error: "Router error: Invalid Password" });
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET);
        console.log(token);
        res
            .cookie("auth_token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
            .json({ message: "Authenticated" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Router error: Something went wrong during login" });
    }
}));
router.get("/me", auth_1.authMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        const user = yield (0, auth_2.findUniqueUserId)(userId);
        if (!user)
            return res.status(401).json({ error: "Router error: User not found" });
        res.json({ user });
    }
    catch (error) {
        res.status(500).json({ error: "Router error: Failed to fetch user" });
    }
}));
// router.get("/me", (_, res) => {
//   return res.json({ status: "Middleware bypass test works" });
// });
router.get("/status", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.auth_token;
    console.log("Token from status : ", token);
    if (!token) {
        return res.json({ authenticated: false });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        return res.json({ authenticated: true, userId: decoded.userId });
    }
    catch (error) {
        return res.json({ authenticated: false });
    }
}));
router.get("/username", auth_1.authMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    try {
        const username = yield (0, auth_2.getUserName)(userId);
        if (!username)
            return res.status(401).json({ error: "Router error: Username not found" });
        return res.json({ username });
    }
    catch (error) {
        console.error("Router error: while getting username:", error);
        res.status(500).json({ error: "Router error: Failed to fetch user" });
    }
}));
exports.default = router;
