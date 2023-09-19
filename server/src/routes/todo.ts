import express from 'express';
import { authenticateJwt, SECRET } from "../middleware/index";
import { PrismaClient } from '@prisma/client';
const router = express.Router();



router.post('/todos', authenticateJwt, async (req, res) => {
  const { title, description } = req.body;
  const userId = typeof (req.headers["userId"]) === "number" ? req.headers["userId"] : 0;

  const prisma = new PrismaClient();

  const newTodo = await prisma.todo.create({
    data: {
      title: title,
      description: description,
      userId: userId
    }
  });

  await prisma.$disconnect();

  if (newTodo) {
    res.status(201).json(newTodo);
  }
  else {
    res.status(500).json({ error: 'Failed to create a new todo' });
  }
});


router.get('/todos', authenticateJwt, async (req, res) => {
  const userId = typeof (req.headers["userId"]) === "number" ? req.headers["userId"] : 0;

  const prisma = new PrismaClient();

  const todos = await prisma.todo.findMany({
    where: {
      userId: userId
    }
  })

  if (todos) {
    res.json(todos);
  }
  else {
    res.status(500).json({ error: 'Failed to retrieve todos' });
  }

});

router.patch('/todos/:todoId/done', authenticateJwt, async (req, res) => {
  const { todoId } = req.params;
  const id = typeof(todoId) === "string" ? parseInt(todoId) : 0;
  const userId = typeof (req.headers["userId"]) === "number" ? req.headers["userId"] : 0;

  const prisma = new PrismaClient();

  const updatedTodo = await prisma.todo.update({
    where : {
      id : id,
      userId : userId
    },
    data : {
      done : true
    }
  })

  await prisma.$disconnect();

  if (updatedTodo) {
    res.json(updatedTodo);
  }
  else {
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

export default router;
