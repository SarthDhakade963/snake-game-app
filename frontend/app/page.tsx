"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/home"); // redirects silently without pushing browser history
  }, [router]);

  return null;
}
