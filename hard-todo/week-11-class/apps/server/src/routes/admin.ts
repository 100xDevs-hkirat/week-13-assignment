import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SECRET, authenticateJwt } from "../middleware/auth";
import { adminTypes, courseTypes } from "types";
import { Prisma, PrismaClient } from "@prisma/client";
export const router = express.Router();

router.get("/me", authenticateJwt, async (req: Request, res: Response) => {
  const parasedInput = adminTypes.safeParse(req.body);
  if (!parasedInput.success) {
    return res.status(411).json({ error: parasedInput.error });
  }
  const { username, password } = parasedInput.data;
  const prisma = new PrismaClient();
  try {
    const admin = await prisma.admin.findUnique({
      where: {
        username,
        password,
      },
    });
    if (admin) {
      res.status(200).json({ username: admin.username });
    } else {
      res.status(403).json({ message: "Admin dosent exists" });
    }
    await prisma.$disconnect();
  } catch (e) {
    console.log(e);
    return res.status(404).json({ message: "db error" });
  }
});

router.post("/signup", async (req: Request, res: Response) => {
  const parasedInput = adminTypes.safeParse(req.body);
  if (!parasedInput.success) {
    return res.status(411).json({ error: parasedInput.error });
  }
  const { username, password } = parasedInput.data;
  const prisma = new PrismaClient();
  try {
    const admin = await prisma.admin.findUnique({
      where: {
        username,
        password,
      },
    });
    if (admin) {
      res.status(403).json({ message: "Admin already exists" });
    } else {
      const newAdmin = await prisma.admin.create({
        data: {
          username,
          password,
        },
      });
      const token = jwt.sign({ username, role: "admin" }, SECRET, {
        expiresIn: "1h",
      });
      res.status(200).json({ message: "Admin created successfully", token });
    }
  } catch (e) {
    console.log(e);
  }
  await prisma.$disconnect();
});

router.post("/login", async (req: Request, res: Response) => {
  const parsedInput = adminTypes.safeParse(req.body);
  if (!parsedInput.success) {
    return res.status(411).json({ error: parsedInput.error });
  }
  const { username, password } = parsedInput.data;
  const prisma = new PrismaClient();
  try {
    const admin = await prisma.admin.findUnique({
      where: {
        username,
        password,
      },
    });
    if (admin) {
      const token = jwt.sign({ username, password }, SECRET, {
        expiresIn: "1h",
      });
      res.status(200).json({ message: "Admin logged in", token });
    } else {
      res.status(403).json({ message: "Admin dosent exists" });
    }
  } catch (e) {
    console.log(e);
    res.status(404).json({ message: "db error" });
  }
  await prisma.$disconnect();
});

router.get("/courses", authenticateJwt, async (req: Request, res: Response) => {
  const parsedInput = courseTypes.safeParse(req.body);
  if (!parsedInput.success) {
    return res.status(411).json({ error: parsedInput.error });
  }
  const course = parsedInput.data;
  const prisma = new PrismaClient();
  try {
    const newCourse = await prisma.course.create({
      data: {
        ...course,
      },
    });
    res.json({
      message: "Course created successfully",
      courseId: newCourse.id,
    });
  } catch (e) {
    res.status(404).json({ message: "db error" });
  }
});

router.put(
  "/courses/:courseId",
  authenticateJwt,
  async (req: Request, res: Response) => {
    const parsedInput = courseTypes.safeParse(req.body);
    if (!parsedInput.success) {
      return res.status(411).json({ error: parsedInput.error });
    }
    const course = parsedInput.data;
    const courseId = parseInt(req.params.courseId);
    const prisma = new PrismaClient();
    try {
      const updatedCourse = await prisma.course.update({
        where: {
          id: courseId,
        },
        data: {
          ...course,
        },
      });
      if (updatedCourse) {
        res.status(200).json({ message: "Course updated successfully" });
      } else {
        res.status(403).json({ message: "Course not found" });
      }
    } catch (e) {
      console.log(e);
      res.status(404).json({ message: "db error" });
    }
    await prisma.$disconnect();
  }
);

router.get("/courses", authenticateJwt, async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  try {
    const courses = prisma.course.findMany({});
    res.json({ courses });
  } catch (e) {
    console.log(e);
    res.status(404).json({ message: "db error" });
  }
  await prisma.$disconnect();
});

// module.exports = router;
