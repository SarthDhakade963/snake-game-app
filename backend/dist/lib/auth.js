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
exports.getUserName = exports.findUniqueUserId = exports.userEmailExists = exports.usernameExists = exports.createUser = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const createUser = (username, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma_1.default.user.create({
            data: {
                username,
                email,
                password,
            },
        });
        return user;
    }
    catch (error) {
        console.error("Server Error while creating user", error);
        throw error;
    }
});
exports.createUser = createUser;
// find unique username
const usernameExists = (username) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userName = yield prisma_1.default.user.findUnique({
            where: { username },
        });
        return userName;
    }
    catch (error) {
        console.error("Server error while finding username exists", error);
        throw error;
    }
});
exports.usernameExists = usernameExists;
const userEmailExists = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userEmail = yield prisma_1.default.user.findUnique({
            where: { email },
        });
        return userEmail;
    }
    catch (error) {
        console.error("Server error while finding user email exists", error);
        throw error;
    }
});
exports.userEmailExists = userEmailExists;
const findUniqueUserId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return prisma_1.default.user.findUnique({
            where: { id },
            select: { id: true, email: true, username: true },
        });
    }
    catch (error) {
        console.error("Server while fetching unique user", error);
        throw error;
    }
});
exports.findUniqueUserId = findUniqueUserId;
const getUserName = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield prisma_1.default.user.findUnique({
            where: { id },
            select: { username: true },
        });
        return (res === null || res === void 0 ? void 0 : res.username) || null;
    }
    catch (error) {
        console.error("Server Error fetching username", error);
        return null;
    }
});
exports.getUserName = getUserName;
