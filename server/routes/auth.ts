import jwt from "jsonwebtoken";
import express from 'express';
import { authenticateJwt, SECRET } from "../middleware/";
import { signupInput } from "@100xdevs/common"
import {PrismaClient} from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/signup', async (req, res) => {
    let parsedInput = signupInput.safeParse(req.body)
    if (!parsedInput.success) {
      return res.status(403).json({
        msg: "error"
      });
    }
    const username = parsedInput.data.username 
    const password = parsedInput.data.password 
    
    const user = await prisma.user.findFirst({
        where : {
            username: username
        }
    })
    if (user) {
      res.status(403).json({ message: 'User already exists' });
    } else {
        const obj = {
            userId: uuidv4(),
            username: username,
            password: password
        }
      const newUser = await prisma.user.create({
          data : obj,
      });
      const token = jwt.sign({ id: obj.userId }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'User created successfully', token });
    }
  });
  
  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({
        where: {
            username : username,
            password : password
        }
    });
    if (user) {
      const token = jwt.sign({ id: user.userId }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'Logged in successfully', token });
    } else {
      res.status(403).json({ message: 'Invalid username or password' });
    }
  });

    router.get('/me', authenticateJwt, async (req, res) => {
        try {
            const userId = req.headers["userId"];
            if (typeof userId === "string") {
                const user = await prisma.user.findUnique({
                    where: {
                        userId: userId
                    }
                });
                if (user) {
                    res.json({username: user.username});
                } else {
                    res.status(403).json({message: 'User not logged in'});
                }
            }
        }
        catch (e) {
            res.status(403).json({ message: 'userId type string[]' });
        }
    });

  export default router
