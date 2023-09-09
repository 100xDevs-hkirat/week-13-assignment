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
exports.router = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const common_1 = require("common");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../middleware/auth");
exports.router = express_1.default.Router();
exports.router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedInput = common_1.userTypes.safeParse(req.body);
    if (!parsedInput.success) {
        return res.status(411).json({ error: parsedInput.error });
    }
    const { username, password } = parsedInput.data;
    const prisma = new client_1.PrismaClient();
    try {
        const user = yield prisma.user.findUnique({
            where: {
                username,
                password,
            },
        });
        if (user) {
            res.status(403).json({ message: "User already exists" });
        }
        else {
            const token = jsonwebtoken_1.default.sign({ username, role: "user" }, auth_1.SECRET, {
                expiresIn: "1h",
            });
            res.status(200).json({ message: "User registered successfully", token });
        }
    }
    catch (e) {
        console.log(e);
        res.status(404).json({ message: "db error" });
    }
    yield prisma.$disconnect();
}));
exports.router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedInput = common_1.userTypes.safeParse(req.body);
    if (!parsedInput.success) {
        return res.status(411).json({ error: parsedInput.error });
    }
    const { username, password } = parsedInput.data;
    const prisma = new client_1.PrismaClient();
    try {
        const user = yield prisma.user.findUnique({
            where: {
                username,
                password,
            },
        });
        if (user) {
            const token = jsonwebtoken_1.default.sign({ username, role: "user" }, auth_1.SECRET, {
                expiresIn: "1h",
            });
            res.json({ message: "User logged", token });
        }
        else {
            res.json({ message: "User dosent exists" });
        }
    }
    catch (e) {
        console.log(e);
    }
    yield prisma.$disconnect();
}));
exports.router.get("/courses", auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient();
    try {
        const courses = yield prisma.course.findMany({
            where: {
                published: true,
            },
        });
        res.json({ courses });
    }
    catch (e) {
        console.log(e);
        res.status(404).json({ message: "db error" });
    }
    yield prisma.$disconnect();
}));
exports.router.post("/courses/:courseId", auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courseId = parseInt(req.params.courseId);
    const prisma = new client_1.PrismaClient();
    try {
        const course = yield prisma.course.findUnique({
            where: {
                id: courseId,
            },
        });
        if (course) {
            if (req.headers["username"] === "string") {
                const username = req.headers["username"];
                const user = yield prisma.user.findUnique({
                    where: {
                        username,
                    },
                });
                if (user) {
                    const updatedUser = yield prisma.user.update({
                        where: {
                            id: user.id,
                        },
                        data: {
                            purchasedCourses: {
                                create: Object.assign({}, course),
                            },
                        },
                    });
                    if (updatedUser) {
                        res.json({ message: "Course purchased successfully" });
                    }
                    else {
                        res.status(403).json({ message: "User not found" });
                    }
                }
                else {
                    res.status(403).json({ message: "User not found" });
                }
            }
            else {
                res.status(403).json({ message: "Course not found" });
            }
        }
    }
    catch (e) {
        console.log(e);
        res.status(404).json({ message: "db error" });
    }
    yield prisma.$disconnect();
}));
exports.router.get("/purchasedCourses", auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof req.headers["username"] === "string") {
        const username = req.headers["username"];
        const prisma = new client_1.PrismaClient();
        try {
            const user = yield prisma.user.findUnique({
                where: { username },
                include: {
                    purchasedCourses: true,
                },
            });
            if (user) {
                res.json({ purchasedCourses: user.purchasedCourses });
            }
            else {
                res.status(403).json({ message: "User not found" });
            }
        }
        catch (e) {
            console.log(e);
            res.status(404).json({ message: "db error" });
        }
        yield prisma.$disconnect();
    }
    else {
        res.status(403).json({ message: "user not found" });
    }
}));
