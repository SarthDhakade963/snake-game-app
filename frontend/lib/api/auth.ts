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

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
console.log("API_URL lib/api/auth.ts", API_URL);

export async function signUp(
  email: string,
  password: string,
  username: string
) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, username }),
  });

  if (!res.ok) throw new Error("Invalid SIGNUP Credentials");

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

// promise is the type of return value that will returned by the function call...
export async function getMe(): Promise<{ email: string } | null> {
  const res = await fetch(`${API_URL}/auth/me`, {
    credentials: "include",
  });

  if (!res.ok) return null;

  const data: MeResponse = await res.json();
  return data.user;
}

export async function getStatus(): Promise<{ authenticated: boolean }> {
  try {
    const res = await fetch(`${API_URL}/auth/status`, {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Auth check failed with status ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error while getting Auth status", error);
    return { authenticated: false };
  }
}

export async function getUserName() {
  const res = await fetch(`${API_URL}/auth/username`, {
    credentials: "include",
  });

  console.log(res);
  if (!res.ok) throw new Error("Invalid fetching username request");

  const data = await res.json();

  if (!data) throw new Error("Invalid fetching username json");
  
  return data.username;
}
export function logout() {
  localStorage.removeItem("token");
}
