"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

const HomePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePlay = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${baseURL}/auth/status`, {
        method: "GET",
        credentials: "include", // include cookies if any
      });

      const data = await res.json();

      if (data.authenticated) {
        router.push("/loading"); // which then routes to /game
      } else {
        router.push("/login"); // or signup
      }
    } catch (error) {
      console.error("Error checking auth: ", error);
      router.push("/login");
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-green-100 p-6 ">
      <h1 className="flex flex-col justify-center items-center text-8xl font-bold text-green-800 mb-4 leading-tight">
        <span className="block">
          🐍 Snake <span className="text-yellow-500">Game</span>
        </span>
      </h1>

      <p className="text-xl text-green-700 mb-8 max-w-md text-center">
        Slither your way to the top! Play the{" "}
        <span className="text-yellow-500">Classic Snake Game</span> with a
        twist.
      </p>

      <div className="flex gap-6">
        <Button
          className="text-lg text-green-500 mb-8 max-w-md text-center py-5 px-10 hover:px-11 hover:py-6 hover:text-2xl bg-yellow-300 hover:bg-yellow-500 hover:text-green-800"
          onClick={handlePlay}
          disabled={loading}
        >
          {loading ? "Loading..." : "Play"}
        </Button>
      </div>
    </main>
  );
};

export default HomePage;
