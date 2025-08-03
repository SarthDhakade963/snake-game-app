type SubmitScoreResponse = {
  id: string;
  userId: string;
  score: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
console.log("Score Routes", API_URL);

export async function submitScore(
  score: number
): Promise<SubmitScoreResponse | void> {
  // const token = localStorage.getItem("auth_token");
  // if (!token) console.log("Token Invalid while submitting score");

  const res = await fetch(`${API_URL}/score/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ score }),
  });

  if (!res.ok) {
    const error = await res.json();
    console.error("Invalid SUBMITSCORE Credentials", error.message);
    return;
  }

  try {
    const data: SubmitScoreResponse = await res.json();

    console.log("Submitted score successfully", data);

    return data;
  } catch (error) {
    console.error("Error submitting score:", error);
  }
}

export async function getHighscore() {
  try {
    const res = await fetch(`${API_URL}/score/highscore`, {
      credentials: "include",
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("Invalid GET HIGHSCORE Credentials", error.message);
      return;
    }

    return res.json();
  } catch (error) {
    console.error("Error while getting HighScore ", error);
  }
}
