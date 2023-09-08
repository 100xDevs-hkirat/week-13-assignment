import jwt from "jsonwebtoken";
import express from "express";
import { authenticateJwt, SECRET } from "../middleware/";
import { signupInput } from "@100xdevs/common";
import { PrismaClient } from "@prisma/client";

const router = express.Router();

router.post("/signup", async (req, res) => {
  let parsedInput = signupInput.safeParse(req.body);
  if (!parsedInput.success) {
    return res.status(403).json({
      msg: "error",
    });
  }
  const username = parsedInput.data.username;
  const password = parsedInput.data.password;
  const prisma = new PrismaClient();
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
        password: password,
      },
    });
    if (user) {
      res.status(403).json({ message: "User already exists" });
    } else {
      const newUser = await prisma.user.create({
        data: {
          username: username,
          password: password,
        },
      });
      const token = jwt.sign({ id: newUser.id }, SECRET, { expiresIn: "1h" });
      res.json({ message: "User created successfully", token });
    }
  } catch (e) {
    console.log(e);
  }
  await prisma.$disconnect();
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const prisma = new PrismaClient();
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
        password,
      },
    });
    if (user) {
      const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "1h" });
      res.json({ message: "Logged in successfully", token });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (e) {
    console.log(e);
  }
  await prisma.$disconnect();
});

router.get("/me", authenticateJwt, async (req, res) => {
  if (typeof req.headers["userId"] === "number") {
    const userId = req.headers["userId"];
    const prisma = new PrismaClient();
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (user) {
        res.json({ username: user.username });
      } else {
        res.status(403).json({ message: "User not logged in" });
      }
    } catch (e) {
      console.log(e);
      res.status(404).json({ message: "internal error" });
    }

    await prisma.$disconnect();
  } else {
    res.status(404).json({ message: "User not logged in" });
  }
});

export default router;
