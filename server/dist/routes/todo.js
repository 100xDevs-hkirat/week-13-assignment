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
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
router.post("/addTodo", index_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description } = req.body;
    const user = yield prisma.user.findUnique({
        where: {
            id: Number(req.headers["userId"])
        }
    });
    if (!user) {
        return res.status(401).json({ message: "user doesn't exist" });
    }
    const newTodo = yield prisma.todo.create({
        data: {
            title,
            description,
            authorId: user.id
        }
    });
    res.status(201).json(newTodo);
}));
router.get("/todos", index_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.headers.userId;
    const todoList = yield prisma.todo.findMany({
        where: {
            authorId: Number(userId)
        }
    });
    res.status(200).json({ todoList });
}));
router.delete("/:todoId", index_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("delete");
        const { todoId } = req.params;
        yield prisma.todo.delete({
            where: {
                id: Number(todoId),
                authorId: Number(req.headers["userId"])
            },
        });
        res.status(200).json({ "message": "delete done!" });
    }
    catch (e) {
        res.status(403).json({ "message": "delete unsuccessful!" });
    }
}));
exports.default = router;
