// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  token: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    const username = req.body.username;
    const password = req.body.password;
    
    const 
  res.status(200).json({ name: 'John Doe' })
}
