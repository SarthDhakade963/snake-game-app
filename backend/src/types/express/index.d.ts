// types/express/index.d.ts
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { userId?: string }; // Adjust fields as per your payload
    }
  }
}
