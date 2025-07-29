"use client";

import { signUpOrLogin } from "@/lib/auth";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Authform = ({ type }: { type: "login" | "signup" }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      await signUpOrLogin(type, email, password, username);
      router.push("/game");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong");
      }
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit} className="">
        <h2>{type}</h2>
        {type === "signup" && (
          <input
            type="text"
            className="p-2 border rounded"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          className="p-2 border rounded"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="p-2 border rounded"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button type="submit" className="bg-black text-white py-2 rounded">
          {type === "signup" ? "Sign Up" : "Log In"}
        </button>
      </form>
    </div>
  );
};

export default Authform;
