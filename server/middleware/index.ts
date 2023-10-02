import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const SECRET = process.env.SECRET || "";

export default function authenticationJWTToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization!;
    if (!authHeader) {
        res.status(401).json({ "message": "missing auth header" })
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, SECRET,(err,payload)=>{
        if(err){
            return res.status(403).json({err});
        }
        if(!payload){
            return res.status(403).json({message:"payload undefined"});
        }
        if(typeof payload === "string"){
            return res.status(403).json({"message":"payload string"});
        }
        req.headers["userId"] = payload.id;
        next();
    }) 



}