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
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("../middleware/index"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express_1.default.Router();
const SECRET = process.env.SECRET || "";
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield prisma.user.findUnique({
        where: {
            username: username
        }
    });
    if (user) {
        return res.status(403).json({ message: 'User already exists' });
    }
    else {
        const newUser = yield prisma.user.create({
            data: {
                username,
                password
            }
        });
        const token = jsonwebtoken_1.default.sign({ username: username }, SECRET, { expiresIn: '1h' });
        res.json({ message: 'User created successfully', token });
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield prisma.user.findUnique({
        where: {
            username: username,
            password: password
        }
    });
    if (!user) {
        res.status(403).json({ message: 'Invalid username or password' });
    }
    else {
        const token = jsonwebtoken_1.default.sign({ id: user.id }, SECRET, { expiresIn: '1h' });
        res.json({ message: 'Logged in successfully', token });
    }
}));
router.get('/me', index_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({
        where: {
            id: req.headers.userId
        }
    });
    if (user) {
        res.json({ username: user.username });
    }
    else {
        res.status(403).json({ message: 'User not logged in' });
    }
}));
router.get('/allTodos', index_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({
        where: {
            id: req.headers.userId
        }
    });
    if (user) {
        console.log(user.todoList);
        res.json({ todos: user.todoList });
    }
    else {
        res.status(403).json({ message: 'User not logged in' });
    }
}));
exports.default = router;
