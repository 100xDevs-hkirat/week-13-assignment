// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'db';
import jwt from "jsonwebtoken";
// import { ensureDbConnected } from '@/lib/dbConnect';

const SECRET = "SECRET";

type Data = {
  token?: string;
  message?: string;
  name?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    console.log("handler called");
    // await ensureDbConnected()
    const { username, password } = req.body;
    // const admin = await Admin.findOne({ username });
    const admin = await prisma.admin.findMany({
      where:{
        username:username,
        password:password
      }
    })
    if (admin.length>0) {
        res.status(403).json({ message: 'Admin already exists' });
    } else {
        // const obj = { username: username, password: password };
        // const newAdmin = new Admin(obj);
        // newAdmin.save();
        const newAdmin=await prisma.admin.create({
          data:{
            username:username,
            password:password
          }
        })
        const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
        res.json({ message: 'Admin created successfully', token });
    }    
}
