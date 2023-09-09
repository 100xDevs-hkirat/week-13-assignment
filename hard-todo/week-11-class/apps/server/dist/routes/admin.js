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
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../middleware/auth");
const common_1 = require("common");
const client_1 = require("@prisma/client");
exports.router = express_1.default.Router();
exports.router.get("/me", auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parasedInput = common_1.adminTypes.safeParse(req.body);
    if (!parasedInput.success) {
        return res.status(411).json({ error: parasedInput.error });
    }
    const { username, password } = parasedInput.data;
    const prisma = new client_1.PrismaClient();
    try {
        const admin = yield prisma.admin.findUnique({
            where: {
                username,
                password,
            },
        });
        if (admin) {
            res.status(200).json({ username: admin.username });
        }
        else {
            res.status(403).json({ message: "Admin dosent exists" });
        }
        yield prisma.$disconnect();
    }
    catch (e) {
        console.log(e);
        return res.status(404).json({ message: "db error" });
    }
}));
exports.router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parasedInput = common_1.adminTypes.safeParse(req.body);
    if (!parasedInput.success) {
        return res.status(411).json({ error: parasedInput.error });
    }
    const { username, password } = parasedInput.data;
    const prisma = new client_1.PrismaClient();
    try {
        const admin = yield prisma.admin.findUnique({
            where: {
                username,
                password,
            },
        });
        if (admin) {
            res.status(403).json({ message: "Admin already exists" });
        }
        else {
            const newAdmin = yield prisma.admin.create({
                data: {
                    username,
                    password,
                },
            });
            const token = jsonwebtoken_1.default.sign({ username, role: "admin" }, auth_1.SECRET, {
                expiresIn: "1h",
            });
            res.status(200).json({ message: "Admin created successfully", token });
        }
    }
    catch (e) {
        console.log(e);
    }
    yield prisma.$disconnect();
}));
exports.router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedInput = common_1.adminTypes.safeParse(req.body);
    if (!parsedInput.success) {
        return res.status(411).json({ error: parsedInput.error });
    }
    const { username, password } = parsedInput.data;
    const prisma = new client_1.PrismaClient();
    try {
        const admin = yield prisma.admin.findUnique({
            where: {
                username,
                password,
            },
        });
        if (admin) {
            const token = jsonwebtoken_1.default.sign({ username, password }, auth_1.SECRET, {
                expiresIn: "1h",
            });
            res.status(200).json({ message: "Admin logged in", token });
        }
        else {
            res.status(403).json({ message: "Admin dosent exists" });
        }
    }
    catch (e) {
        console.log(e);
        res.status(404).json({ message: "db error" });
    }
    yield prisma.$disconnect();
}));
exports.router.post("/courses", auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedInput = common_1.courseTypes.safeParse(req.body);
    if (!parsedInput.success) {
        return res.status(411).json({ error: parsedInput.error });
    }
    const course = parsedInput.data;
    const prisma = new client_1.PrismaClient();
    try {
        const newCourse = yield prisma.course.create({
            data: Object.assign({}, course),
        });
        res.json({
            message: "Course created successfully",
            courseId: newCourse.id,
        });
    }
    catch (e) {
        console.log(e);
        res.status(404).json({ message: "db error" });
    }
}));
exports.router.put("/courses/:courseId", auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedInput = common_1.courseTypes.safeParse(req.body);
    if (!parsedInput.success) {
        return res.status(411).json({ error: parsedInput.error });
    }
    const course = parsedInput.data;
    const courseId = parseInt(req.params.courseId);
    const prisma = new client_1.PrismaClient();
    try {
        const updatedCourse = yield prisma.course.update({
            where: {
                id: courseId,
            },
            data: Object.assign({}, course),
        });
        if (updatedCourse) {
            res.status(200).json({ message: "Course updated successfully" });
        }
        else {
            res.status(403).json({ message: "Course not found" });
        }
    }
    catch (e) {
        console.log(e);
        res.status(404).json({ message: "db error" });
    }
    yield prisma.$disconnect();
}));
exports.router.get("/courses", auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient();
    try {
        const courses = prisma.course.findMany({});
        res.json({ courses });
    }
    catch (e) {
        console.log(e);
        res.status(404).json({ message: "db error" });
    }
    yield prisma.$disconnect();
}));
// module.exports = router;
