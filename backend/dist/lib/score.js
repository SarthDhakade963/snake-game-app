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
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearScores = exports.getAllScores = exports.getHighScore = exports.saveScore = void 0;
const prisma_1 = __importDefault(require("../prisma"));
// Saving Score
const saveScore = (userId, score) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newScore = yield prisma_1.default.score.create({
            data: {
                userId,
                score,
            },
        });
        return newScore;
    }
    catch (error) {
        console.error("Server Error: Error saving score", error);
        throw error;
    }
});
exports.saveScore = saveScore;
// get the highest score of user
const getHighScore = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const highScore = yield prisma_1.default.score.findFirst({
            where: { userId },
            orderBy: { score: "desc" },
        });
        return (_a = highScore === null || highScore === void 0 ? void 0 : highScore.score) !== null && _a !== void 0 ? _a : 0;
    }
    catch (error) {
        console.error("Server Error: Error getting highscore", error);
        throw error;
    }
});
exports.getHighScore = getHighScore;
// Getting all scores
const getAllScores = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const scores = yield prisma_1.default.score.findMany({
            where: { userId },
            orderBy: { score: "desc" },
        });
        return scores;
    }
    catch (error) {
        console.error("Server Error: Error getting all scores", error);
        throw error;
    }
});
exports.getAllScores = getAllScores;
// Clearing all scores
const clearScores = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield prisma_1.default.score.deleteMany({
            where: { userId },
        });
        return deleted;
    }
    catch (error) {
        console.error("Server Error: Error clearing scores", error);
        throw error;
    }
});
exports.clearScores = clearScores;
