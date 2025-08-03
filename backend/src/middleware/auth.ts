import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleWare = (
  req: Request,
  res: Response,
  nf: NextFunction
) => {
  try {
    // get the token
    const token = (req.cookies as any)?.auth_token;

    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized. auth_token missing" });
    }

    // verify the token if it is authorised
    const payload = jwt.verify(token, process.env.JWT_SECRET as string);

    (req as any).user = payload;

    return nf();
  } catch (error) {
    console.error("❌ JWT verification failed:", error);

    res.status(401).json({ error: "Invalid Token provided in authMiddleWare" });
  }
};
