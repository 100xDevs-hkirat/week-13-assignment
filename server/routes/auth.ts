import express from 'express';
import auth from '../middleware/index';
import jwt from 'jsonwebtoken';

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();
const SECRET = process.env.SECRET || "";

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({
        where: {
            username: username
        }
    });
    if (user) {
        return res.status(403).json({ message: 'User already exists' });
    } else {
        const newUser = await prisma.user.create({
            data: {
                username,
                password
            }
        });
        const token = jwt.sign({ username: username }, SECRET, { expiresIn: '1h' });
        res.json({ message: 'User created successfully', token });
    }

})


router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({
        where: {

            username: username,
            password: password

        }
    });
    if (!user) {
        res.status(403).json({ message: 'Invalid username or password' });
    } else {
        const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1h' });
        res.json({ message: 'Logged in successfully', token });
    }

})

router.get('/me', auth, async (req, res) => {

    const user = await prisma.user.findUnique({
        where: {
            id: req.headers.userId
        }
    });
    if (user) {
        res.json({ username: user.username });
    } else {
        res.status(403).json({ message: 'User not logged in' });
    }
})

export default router;