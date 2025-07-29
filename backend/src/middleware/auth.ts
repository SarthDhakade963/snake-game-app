import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET: string = process.env.JWT_SECRET ?? "";

export const authMiddleWare = (
  req: Request,
  res: Response,
  nf: NextFunction
) => {
  try {
    // request header contains the token
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or Invalid token" });
    }

    // get the token
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token missing" });
    }

    // verify the token if it is authorised
    const payload = jwt.verify(token, JWT_SECRET);

    (req as any).user = payload;
    return nf();
  } catch (error) {
    res.status(401).json({ error: "Invalid Token" });
  }
};
