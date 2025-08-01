import { Router } from "express";
import {
  clearScores,
  getAllScores,
  getHighScore,
  saveScore,
} from "../lib/score";
import { authMiddleWare } from "../middleware/auth";

// Verifies the token from Authorization header.
// Decodes the token and attaches user (e.g., { id, email }) to req.
// Your route handlers trust req.user.id without needing it from the client.

const router = Router();

router.post("/", authMiddleWare, async (req, res) => {
  console.log("➡️  /score POST called");

  const userId = req.user?.userId;
  
  if (!userId) {
    return res
      .status(400)
      .json({ message: "Invalid payload user id while getting score" });
  }

  const score = Number(req.body.score); // cast score

  if (isNaN(score)) {
    return res
      .status(400)
      .json({ message: "Invalid payload score is not a number" });
  }

  try {
    const newScore = await saveScore(userId, score);

    return res.status(201).json(newScore);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to save score" });
  }
});

// GET /score/highscore/:userId
router.get("/highscore", authMiddleWare, async (req, res) => {
  console.log("➡️  /score/highscore GET called");
  const usrId = req.user?.userId;

  try {
    const highScore = await getHighScore(usrId as string);

    return res.status(200).json(highScore);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error getting highscore" });
  }
});

// get all scores of user
// GET /score/:userId
router.get("/", authMiddleWare, async (req, res) => {
  console.log("➡️  /score/ GET called");
  const userId = req.user?.userId;

  try {
    const getScore = await getAllScores(userId as string);

    return res.status(200).json(getScore);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error getting all scores" });
  }
});

// delete scores of user
router.delete("/", authMiddleWare, async (req, res) => {
  console.log("➡️  /score/ DELETE called");
  const userId = req.user?.userId;

  try {
    const deleted = await clearScores(userId as string);

    return res.status(200).json(deleted);
  } catch (error) {
    console.error(error);
    return res.status(500).json("Error deleting scores");
  }
});

export default router;
