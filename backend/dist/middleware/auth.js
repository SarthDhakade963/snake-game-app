"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleWare = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleWare = (req, res, nf) => {
    var _a;
    try {
        // get the token
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.auth_token;
        if (!token) {
            return res
                .status(401)
                .json({ error: "Unauthorized. auth_token missing" });
        }
        // verify the token if it is authorised
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        return nf();
    }
    catch (error) {
        console.error("❌ JWT verification failed:", error);
        res.status(401).json({ error: "Invalid Token provided in authMiddleWare" });
    }
};
exports.authMiddleWare = authMiddleWare;
