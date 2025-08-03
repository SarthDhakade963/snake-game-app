"use client";

import SnakeGame from "@/components/SnakeGame";
import { getStatus } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const SnakeGamePage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const data = await getStatus();

      if (!data.authenticated) {
        router.push("/login");
      } else {
        setIsAuthenticated(true);
      }
    };

    checkAuth();
  }, [router]);

  if (isAuthenticated === null) return null; // Or a loading spinner

  return (
    <main className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      <SnakeGame />
    </main>
  );
};

export default SnakeGamePage;
