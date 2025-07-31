import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma";
import { authMiddleWare } from "../middleware/auth";

const router = express.Router(); // create the constructor of roter

const JWT_SECRET: string = process.env.JWT_SECRET ?? "";

// sign up router
router.post("/signup", async (req, res) => {
  // during signup client sends the username, email and password
  const { username, email, password } = req.body;

  try {
    // checks if the user input username is unique
    const userNameExists = await prisma.user.findUnique({
      where: { username },
    });
    // if username exists then send Bad Request status (400)
    if (userNameExists)
      return res.status(400).json({ error: "Username already exists" });

    // if user with email exists then send Bad Request status (400)
    const userExists = await prisma.user.findUnique({ where: { email } });
    // if user with email exists then send Bad Request status (400)
    if (userExists)
      return res.status(400).json({ error: "User already exists" });

    // bcrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // store the user info in DB
    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });
    // 🔸 jwt.sign(payload, secret) : Creates a JWT token
    // payload : The data you want to include inside the token.
    // JWT_SECRET: This is the secret key used to digitally sign the token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);

    res
      .cookie("auth_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false, // for testing //process.env.NODE_ENV === "production"
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({ message: "Authenticated" });
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("LOGIN REQUEST:", { email, password });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid Password" });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);

    res
      .cookie("auth_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({ message: "Authenticated" });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/me", authMiddleWare, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, username: true },
    });

    if (!user) return res.status(401).json({ error: "User not found" });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// router.get("/me", (_, res) => {
//   return res.json({ status: "Middleware bypass test works" });
// });

router.get("/status", async (req, res) => {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.json({ authenticated: true, userId: (decoded as any).userId });
  } catch (error) {
    return res.json({ authenticated: false });
  }
});

export default router;
