// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from "jsonwebtoken";
import { PrismaClient } from 'db';
const SECRET = "SECRET";

type Data = {
  token?: string;
  message?: string;
  name?: string;
}

const client = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    console.log("handler called");
    const { username, password } = req.body;
    const admin = await client.user.findUnique({
      where: {
        username
      }
    });
    if (admin) {
        res.status(403).json({ message: 'Admin already exists' });
    } else {
        const obj = { username, password };
        const newAdmin = await client.user.create({
          data: obj
        });

        const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
        res.json({ message: 'Admin created successfully', token });
    }    
}
