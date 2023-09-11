import express from 'express';
import auth from "../middleware/index";
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();
const router = express.Router();

router.post("/addTodo", auth, async (req: Request, res: Response) => {
    const { title, description } = req.body;
    const user = await prisma.user.findUnique({
        where: {
            id: Number(req.headers["userId"])
        }
    });
    if (!user) {
        return res.status(401).json({ message: "user doesn't exist" })
    }
    const newTodo = await prisma.todo.create({
        data: {
            title,
            description,
            authorId: user.id
        }
    });

    res.status(201).json(newTodo);
})

router.get("/todos", auth, async (req, res) => {
    const userId = req.headers.userId;
    const todoList = await prisma.todo.findMany({
        where: {
            authorId: Number(userId)
        }
    });
    res.status(200).json({ todoList });
})

router.delete("/:todoId", auth, async (req, res) => {
    try {
        console.log("delete")
        const { todoId } = req.params;


        await prisma.todo.delete({
            where: {
                id: Number(todoId),
                authorId: Number(req.headers["userId"])
            },
        });
        res.status(200).json({ "message": "delete done!" })
    } catch (e) {
        res.status(403).json({ "message": "delete unsuccessful!" })
    }
})

export default router;