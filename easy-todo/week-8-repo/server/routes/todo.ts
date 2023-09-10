import express from "express";
import { authenticateJwt, SECRET } from "../middleware/index";
import { Prisma, PrismaClient } from "@prisma/client";
const router = express.Router();

interface CreateTodoInput {
  title: string;
  description: string;
}

router.post("/todos", authenticateJwt, async (req, res) => {
  const { title, description } = req.body;
  const done = false;
  if (typeof req.headers["userId"] === "number") {
    const userId: number = req.headers["userId"];
    const prisma = new PrismaClient();

    try {
      const newTodo = await prisma.todo.create({
        data: {
          title,
          description,
          done,
          userId,
        },
      });
      res.status(200).json(newTodo);
    } catch (e) {
      console.log(e);
      res.status(403).json({ message: "Internal error" });
    }
    await prisma.$disconnect();
  } else {
    res.status(403).json({ message: "User not logged in" });
  }
});

router.get("/todos", authenticateJwt, async (req, res) => {
  if (typeof req.headers["userId"] === "number") {
    const userId: number = req.headers["userId"];
    const prisma = new PrismaClient();
    try {
      const todos = await prisma.todo.findMany({
        where: {
          userId,
        },
      });
      res.json(todos);
    } catch (e) {
      console.log(e);
    }
    await prisma.$disconnect();
  } else {
    res.status(404).json({ message: "Internal error" });
  }
});

router.patch("/todos/:todoId/done", authenticateJwt, async (req, res) => {
  const { todoId } = req.params;
  const userId = req.headers["userId"];
  if (typeof todoId === "string" && typeof userId === "number") {
    const prisma = new PrismaClient();
    try {
      // console.log(todoId, userId);
      const updatedTodo = await prisma.todo.update({
        where: {
          id: parseInt(todoId),
          userId,
        },
        data: {
          done: true,
        },
      });
      if (updatedTodo) {
        res.json(updatedTodo);
      } else {
        res.status(403).json({ message: "Todo not found" });
      }
    } catch (e) {
      console.log(e);
    }
    await prisma.$disconnect();
  } else {
    res.status(404).json({ message: "User not logged in" });
  }
});

export default router;
