"use client"

import React, { useState } from "react";
import {
  UserIcon,
  MailIcon,
  LockIcon,
  AlertCircleIcon,
  AppleIcon,
} from "lucide-react";

interface AuthFormProps {
  type: "login" | "signup";
}

export const StyledAuthform: React.FC<AuthFormProps> = ({ type }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      console.log("Authenticating with:", {
        type,
        email,
        password,
        username,
      });
      alert(
        `${type === "signup" ? "Account created" : "Logged in"} successfully!`
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100 p-4">
      <div className="relative w-full max-w-md">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-500 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-yellow-400 rounded-full opacity-20 blur-3xl" />

        <div className="relative bg-white border-4 border-green-500 rounded-3xl shadow-2xl overflow-hidden z-10">
          <div className="h-6 bg-green-500 flex">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-6 bg-green-600 rounded-full mx-0.5"
              />
            ))}
          </div>

          <div className="bg-green-400 p-6 text-center">
            <div className="relative bg-yellow-300 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-3 border-4 border-green-500">
              <div className="absolute w-16 h-16 rounded-full bg-yellow-300 flex items-center justify-center">
                <div className="absolute top-3 left-3 w-3 h-6 bg-green-800 rounded-full" />
                <div className="absolute bottom-2 w-1 h-4 bg-red-500 rounded-full" />
                <div className="absolute bottom-0 left-[9px] w-1 h-2 bg-red-500 rounded-full rotate-45" />
                <div className="absolute bottom-0 right-[9px] w-1 h-2 bg-red-500 rounded-full -rotate-45" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-green-800 tracking-wide">
              {type === "signup" ? "Join Snake Adventure!" : "Slither Back In!"}
            </h2>
          </div>

          <div className="p-8 bg-green-50">
            <form onSubmit={handleSubmit} className="space-y-5">
              {type === "signup" && (
                <div>
                  <label className="text-green-700 font-medium block mb-2 ml-1 text-lg">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <UserIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <input
                      type="text"
                      placeholder="Your snake name"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-white text-green-800 pl-12 pr-4 py-4 rounded-2xl border-2 border-green-400 focus:border-green-600 focus:ring-2 focus:ring-green-300 focus:outline-none transition-colors text-lg"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-green-700 font-medium block mb-2 ml-1 text-lg">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <MailIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white text-green-800 pl-12 pr-4 py-4 rounded-2xl border-2 border-green-400 focus:border-green-600 focus:ring-2 focus:ring-green-300 focus:outline-none transition-colors text-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-green-700 font-medium block mb-2 ml-1 text-lg">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <LockIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <input
                    type="password"
                    placeholder="Secret password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white text-green-800 pl-12 pr-4 py-4 rounded-2xl border-2 border-green-400 focus:border-green-600 focus:ring-2 focus:ring-green-300 focus:outline-none transition-colors text-lg"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-100 border-2 border-red-400 rounded-2xl p-4">
                  <p className="text-red-600 text-sm flex items-center">
                    <AlertCircleIcon className="w-5 h-5 mr-2" />
                    {error}
                  </p>
                </div>
              )}

              <div className="relative flex justify-center my-2">
                <div className="absolute -top-2 w-3 h-4 bg-green-800 rounded-sm" />
                <AppleIcon className="w-8 h-8 text-red-500" />
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-bold text-xl transform hover:scale-[1.02] transition-all duration-150 shadow-lg shadow-green-300 border-b-4 border-green-700"
              >
                {type === "signup" ? "Start Playing!" : "Let's Go!"}
              </button>
            </form>
          </div>

          <div className="h-6 bg-green-500 flex">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-6 bg-green-600 rounded-full mx-0.5"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
