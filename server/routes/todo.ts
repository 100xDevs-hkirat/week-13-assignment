import express from 'express';
import { authenticateJwt, SECRET } from "../middleware/index";
import {PrismaClient} from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

interface CreateTodoInput {
  title: string;
  description: string;
}

router.post('/todos', authenticateJwt, async (req, res) => {
  const { title, description } = req.body;
  const done = false;
  const userId = req.headers["userId"];

  if (typeof userId === "string") {
    try {
      // Use await to ensure the todo is created before sending the response
      const newTodo = await prisma.todos.create({
        data: {
          title: title,
          description: description,
          done: done,
          authorId: userId
        }
      });
      res.status(201).json(newTodo);
    } catch (error) {
      // Handle any potential errors from Prisma
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(400).json({ error: "userId is not a string" });
  }
});



router.get('/todos', authenticateJwt,async (req, res) => {
  const userId = req.headers["userId"];
  if (typeof userId === "string") {
    const todos = await prisma.todos.findMany({
      where: {
        authorId: userId
      }
    });
    res.json(todos);
  }
  res.status(500).json({ error: 'userid is not a string' });
});

router.patch('/todos/:todoId/done', authenticateJwt, async (req, res) => {
  const { todoId } = req.params;
  const userId = req.headers["userId"];

  if (typeof userId === "string") {
    const updatedTodo = await prisma.todos.update({
      where: {
        id: Number(todoId)
      },
      data: {
        done: true
      }
    });
    res.json(updatedTodo);
  }
  else{
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

export default router;
