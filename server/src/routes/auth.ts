import jwt from "jsonwebtoken";
import express from 'express';
import { authenticateJwt, SECRET } from "../middleware";
import { signupInput } from "@100xdevs/common"
import { PrismaClient } from '@prisma/client';

const router = express.Router();

router.post('/signup', async (req, res) => {
  let parsedInput = signupInput.safeParse(req.body)
  if (!parsedInput.success) {
    return res.status(403).json({
      msg: "error"
    });
  }
  const username = parsedInput.data.username
  const password = parsedInput.data.password

  const prisma = new PrismaClient({ log: ['error', 'info', 'query'] });

  const user = await prisma.user.findFirst({
    where: {
      username: username
    }
  });

  if (user) {
    res.status(403).json({ message: 'User already exists' });
  } else {
    const user = await prisma.user.create({
      data: {
        username: username,
        password: password
      }
    })
    await prisma.$disconnect();
    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1h' });
    
    res.json({ message: 'User created successfully', token});
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const prisma = new PrismaClient({ log: ['error', 'info', 'query'] });

  const user = await prisma.user.findFirst({
    where: {
      username: username
    }
  });

  await prisma.$disconnect();

  if (user) {
    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1h' });
    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(403).json({ message: 'Invalid username or password' });
  }
});

  router.get('/me', authenticateJwt, async (req, res) => {
    const temp = req.headers["userId"];
    const userId = typeof(temp) === "string" || typeof(temp) == "number" ? parseInt(temp) : 0;

    const prisma = new PrismaClient({ log: ['error', 'info', 'query'] });


    const user = await prisma.user.findFirst({
      where: {
        id : userId
      }
    });
  
    await prisma.$disconnect();

    if (user) {
      res.json({ username: user.username });
    } else {
      res.status(403).json({ message: 'User not logged in' });
    }
  });

export default router
