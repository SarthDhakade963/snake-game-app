"use client";
import SnakeGame from "@/components/SnakeGame";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const SnakeGamePage = () => {
  const router = useRouter();
  // protects the game page from unauthorized access
  
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch(`${BASE_URL}/auth/status`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!data.authenticated) {
        router.push("/login");
      }
    };
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <main className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      <SnakeGame />
    </main>
  );
};

export default SnakeGamePage;
