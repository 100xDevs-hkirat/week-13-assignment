import { Prisma, PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import { userTypes } from "common";
import jwt from "jsonwebtoken";
import { SECRET, authenticateJwt } from "../middleware/auth";
import { User } from "db";
export const router = express.Router();

router.post("/signup", async (req: Request, res: Response) => {
  const parsedInput = userTypes.safeParse(req.body);
  if (!parsedInput.success) {
    return res.status(411).json({ error: parsedInput.error });
  }
  const { username, password } = parsedInput.data;
  const prisma = new PrismaClient();
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
        password,
      },
    });
    if (user) {
      res.status(403).json({ message: "User already exists" });
    } else {
      const token = jwt.sign({ username, role: "user" }, SECRET, {
        expiresIn: "1h",
      });
      res.status(200).json({ message: "User registered successfully", token });
    }
  } catch (e) {
    console.log(e);
    res.status(404).json({ message: "db error" });
  }
  await prisma.$disconnect();
});

router.post("/login", async (req: Request, res: Response) => {
  const parsedInput = userTypes.safeParse(req.body);
  if (!parsedInput.success) {
    return res.status(411).json({ error: parsedInput.error });
  }
  const { username, password } = parsedInput.data;
  const prisma = new PrismaClient();
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
        password,
      },
    });
    if (user) {
      const token = jwt.sign({ username, role: "user" }, SECRET, {
        expiresIn: "1h",
      });
      res.json({ message: "User logged", token });
    } else {
      res.json({ message: "User dosent exists" });
    }
  } catch (e) {
    console.log(e);
  }
  await prisma.$disconnect();
});

router.get("/courses", authenticateJwt, async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  try {
    const courses = await prisma.course.findMany({
      where: {
        published: true,
      },
    });
    res.json({ courses });
  } catch (e) {
    console.log(e);
    res.status(404).json({ message: "db error" });
  }
  await prisma.$disconnect();
});

router.post(
  "/courses/:courseId",
  authenticateJwt,
  async (req: Request, res: Response) => {
    const courseId = parseInt(req.params.courseId);
    const prisma = new PrismaClient();
    try {
      const course = await prisma.course.findUnique({
        where: {
          id: courseId,
        },
      });
      if (course) {
        if (req.headers["username"] === "string") {
          const username: string = req.headers["username"];
          const user = await prisma.user.findUnique({
            where: {
              username,
            },
          });
          if (user) {
            const updatedUser = await prisma.user.update({
              where: {
                id: user.id,
              },
              data: {
                purchasedCourses: {
                  create: {
                    ...course,
                  },
                },
              },
            });
            if (updatedUser) {
              res.json({ message: "Course purchased successfully" });
            } else {
              res.status(403).json({ message: "User not found" });
            }
          } else {
            res.status(403).json({ message: "User not found" });
          }
        } else {
          res.status(403).json({ message: "Course not found" });
        }
      }
    } catch (e) {
      console.log(e);
      res.status(404).json({ message: "db error" });
    }
    await prisma.$disconnect();
  }
);

router.get(
  "/purchasedCourses",
  authenticateJwt,
  async (req: Request, res: Response) => {
    if (typeof req.headers["username"] === "string") {
      const username = req.headers["username"];
      const prisma = new PrismaClient();
      try {
        const user = await prisma.user.findUnique({
          where: { username },
          include: {
            purchasedCourses: true,
          },
        });
        if (user) {
          res.json({ purchasedCourses: user.purchasedCourses });
        } else {
          res.status(403).json({ message: "User not found" });
        }
      } catch (e) {
        console.log(e);
        res.status(404).json({ message: "db error" });
      }
      await prisma.$disconnect();
    } else {
      res.status(403).json({ message: "user not found" });
    }
  }
);