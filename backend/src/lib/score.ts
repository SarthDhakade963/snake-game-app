import { log } from "node:console";
import prisma from "../prisma";

// Saving Score
export const saveScore = async (userId: string, score: number) => {
  try {
    const newScore = await prisma.score.create({
      data: {
        userId,
        score,
      },
    });

    return newScore;
  } catch (error) {
    console.error("Server Error: Error saving score", error);
    throw error;
  }
};

// get the highest score of user
export const getHighScore = async (userId: string) => {
  try {
    const highScore = await prisma.score.findFirst({
      where: { userId },
      orderBy: { score: "desc" },
    });

    return highScore?.score ?? 0;
  } catch (error) {
    console.error("Server Error: Error getting highscore", error);
    throw error;
  }
};

// Getting all scores
export const getAllScores = async (userId: string) => {
  try {
    const scores = await prisma.score.findMany({
      where: { userId },
      orderBy: { score: "desc" },
    });

    return scores;
  } catch (error) {
    console.error("Server Error: Error getting all scores", error);
    throw error;
  }
};

// Clearing all scores
export const clearScores = async (userId: string) => {
  try {
    const deleted = await prisma.score.deleteMany({
      where: { userId },
    });

    return deleted;
  } catch (error) {
    console.error("Server Error: Error clearing scores", error);
    throw error;
  }
};
