import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
export const SECRET = "SECr3t";

export const authenticateJwt = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      if (!user || typeof user === "string") {
        return res.sendStatus(403);
      }
      req.headers["username"] = user.username;
      req.headers["role"] = user.role;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
