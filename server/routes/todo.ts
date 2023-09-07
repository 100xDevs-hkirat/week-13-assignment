import express from 'express';
import { authenticateJwt, SECRET } from "../middleware/index";
const router = express.Router();

import {PrismaClient} from '@prisma/client';
import { date } from 'zod';

const prisma=new PrismaClient();

interface CreateTodoInput {
  title: string;
  description: string;
}

router.post('/todos', authenticateJwt, async (req, res) => {
  console.log("hi")
  const { title, description } = req.body;
  const done = false;
  const userId = req.headers["userId"];

  const newTodo=await prisma.todo.create({
    data:{
      description:description,
      title:title,
      //@ts-ignore
      userId:userId
    }
  })
  res.status(200).send(newTodo);
});


router.get('/todos', authenticateJwt,async (req, res) => {
  const userId = req.headers["userId"];

  const todos=await prisma.todo.findMany({
    where:{
      //@ts-ignore
      userId:userId
    }
  })
  res.json(todos);

  // Todo.find({ userId })
  //   .then((todos) => {
  //     res.json(todos);
  //   })
  //   .catch((err) => {
  //     res.status(500).json({ error: 'Failed to retrieve todos' });
  //   });
});

router.patch('/todos/:todoId/done', authenticateJwt,async (req, res) => {
  const { todoId } = req.params;
  const userId = req.headers["userId"];

  const taskID=parseInt(todoId);
  console.log(taskID)

  const updatedTodo=await prisma.todo.update({
    where:{
      //@ts-ignore
      userId:userId,
      //@ts-ignore
      id:taskID
    },
    data:{
      done:true
    }
  })
  console.log(updatedTodo)
  res.json(updatedTodo);


  // Todo.findOneAndUpdate({ _id: todoId, userId }, { done: true }, { new: true })
  //   .then((updatedTodo) => {
  //     if (!updatedTodo) {
  //       return res.status(404).json({ error: 'Todo not found' });
  //     }
  //     res.json(updatedTodo);
  //   })
  //   .catch((err) => {
  //     res.status(500).json({ error: 'Failed to update todo' });
  //   });
});

export default router;
