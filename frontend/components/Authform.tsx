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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md animate-fade-in">
        <h2 className="text-2xl font-bold text-center mb-6 capitalize">
          {type === "signup" ? "Create Account" : "Welcome Back"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {type === "signup" && (
            <div>
              <label htmlFor="username" className="font-bold">
                Enter Username :
              </label>
              <input
                type="text"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mt-1"
                required
              />
            </div>
          )}

          <label htmlFor="email" className="font-bold">
            Enter Email :
          </label>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mt-1"
            required
          />

          <label htmlFor="password" className="font-bold">
            Enter Password :
          </label>
          <input
            type="password"
            className="w-full p-3 border border-gray-300 rounded-lg mt-1"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {type === "signup" ? "Sign Up" : "Log In"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          {type === "signup"
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <a
            href={type === "signup" ? "/login" : "/signup"}
            className="text-blue-600 font-medium hover:underline"
          >
            {type === "signup" ? "Login" : "Sign up"}
          </a>
        </p>
      </div>
    </div>
  );
};

export default Authform;
