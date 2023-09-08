import express from 'express';
import auth from "../middleware/index";
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();
const router = express.Router();

router.post("/addTodo", auth, async (req:Request, res:Response) => {
    const { title, description } = req.body;
    const user = await prisma.user.findUnique({ 
        where: { 
            id: Number(req.headers["userId"])
        } 
    });
    if(!user){
        return res.status(401).json({message:"user doesn't exist"})
    }
    const newTodo = await prisma.todo.create({ 
        data: { 
            title, 
            description, 
            authorId: user.id
        } 
    });

    res.status(201).json(newTodo);
})
    ;
router.put("/updateTodo/:todoId", auth, async (req, res) => {
    const { title, description, complete } = req.body;
    console.log(title, description, complete)
    const {todoId} = req.params;
    const newTodo = await prisma.todo.update({ 
        where:{
            id:Number(todoId)
        },
        data: { 
            title, 
            description, 
            complete 
        } 
    });
    res.status(200).json(newTodo);
})

router.delete("/deleteTodo/:todoId", auth, async(req, res) => {
    const {todoId} = req.params;
    const deleteTodo = await prisma.todo.delete({
        where:{
            id:Number(todoId)
        }
    })
    res.status(200).json({message:"deleted todo"});
})
router.get("/getTodo", auth, async(req, res) => {
    const userId = req.headers.userId;
    const todoList = await prisma.todo.findMany({
        where:{
            authorId:Number(userId)
        }
    });
    res.status(200).json(todoList);
})

export default router;