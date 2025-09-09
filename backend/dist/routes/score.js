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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const score_1 = require("../lib/score");
const auth_1 = require("../middleware/auth");
// Verifies the token from Authorization header.
// Decodes the token and attaches user (e.g., { id, email }) to req.
// Your route handlers trust req.user.id without needing it from the client.
const router = (0, express_1.Router)();
router.post("/", auth_1.authMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        return res
            .status(400)
            .json({ message: "Invalid payload user id while getting score" });
    }
    const score = Number(req.body.score); // cast score
    if (isNaN(score)) {
        return res
            .status(400)
            .json({ message: "Invalid payload score is not a number" });
    }
    try {
        const newScore = yield (0, score_1.saveScore)(userId, score);
        return res.status(201).json(newScore);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to save score" });
    }
}));
// GET /score/highscore/:userId
router.get("/highscore", auth_1.authMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const usrId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    try {
        const highScore = yield (0, score_1.getHighScore)(usrId);
        return res.status(200).json(highScore);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error getting highscore" });
    }
}));
// get all scores of user
// GET /score/:userId
router.get("/", auth_1.authMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    try {
        const getScore = yield (0, score_1.getAllScores)(userId);
        return res.status(200).json(getScore);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error getting all scores" });
    }
}));
// delete scores of user
router.delete("/", auth_1.authMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    try {
        const deleted = yield (0, score_1.clearScores)(userId);
        return res.status(200).json(deleted);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json("Error deleting scores");
    }
}));
exports.default = router;
