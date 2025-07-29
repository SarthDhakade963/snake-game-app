export const API_URL = "http://localhost:5000";

type AuthResponse = { token: string };
type MeResponse = { user: { email: string; id: string; createdAt: string } };

export async function signUpOrLogin(
  type: "login" | "signup",
  email: string,
  password: string,
  username: string
) {
  if (type === "login") {
    return logIn(email, password);
  } else {
    return signUp(email, password, username);
  }
}

export async function signUp(
  email: string,
  password: string,
  username: string
) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ email, password, username }),
  });

  if (!res.ok) throw new Error("Invalid Credentials");

  try {
    const data: AuthResponse = await res.json();
    localStorage.setItem("token", data.token);
  } catch (error) {
    console.error("Invalid signup data", error);
  }
}

export async function logIn(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Invalid login credentials");

  try {
    const data: AuthResponse = await res.json();
    localStorage.setItem("token", data.token);
  } catch (error) {
    console.error("Invalid login data", error);
  }
}

export async function getMe(): Promise<{ email: string } | null> {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return null;

  const data: MeResponse = await res.json();
  return data.user;
}

export function logout() {
  localStorage.removeItem("token");
}
