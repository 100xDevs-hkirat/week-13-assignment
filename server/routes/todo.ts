import express from 'express';
import { authenticateJwt, SECRET } from "../middleware/index";
import { PrismaClient } from '@prisma/client';
const router = express.Router();

interface CreateTodoInput {
  title: string;
  description: string;
}

const client = new PrismaClient();

router.post('/todos', authenticateJwt, async (req, res) => {
  try {

    const { title, description } = req.body;
    const done = false;
    const userId = req.headers["userId"];

    const newTodo = await client.todo.create({
      data: {
        title,
        description,
        user: {
          connect: {
            id: parseInt(userId as string)
          }
        }
      }
    });
    return res.status(200).json({ savedTodo: newTodo });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create a new todo' });
  }
});


router.get('/todos', authenticateJwt, async (req, res) => {
  try {
    const userId = req.headers["userId"];

    const user = await client.user.findUnique({
      where: {
        id: parseInt(userId as string)
      },
      include: {
        todos: true
      }
    });


    return res.status(200).json({ todos: user?.todos });

  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve todos' });
  }
});

router.patch('/todos/:todoId/done', authenticateJwt, async (req, res) => {
  try {
    const { todoId } = req.params;
    const userId = req.headers["userId"];

    const todo = await client.todo.update({
      where: {
        id: parseInt(todoId as string)
      },
      data: {
        done: true
      }
    });

    if(!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    return res.status(200).json({ updatedTodo: todo })
    
  } catch (error) { 
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

export default router;
