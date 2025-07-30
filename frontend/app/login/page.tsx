"use client";
import LoadPage from "@/components/LoadingPage";
import dynamic from "next/dynamic";

const StyledAuthform = dynamic(
  () => import("@/components/StyledAuthform").then((mod) => mod.StyledAuthform),
  { ssr: false }
);
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSuccess = () => {
    setLoading(true);
    setTimeout(() => {
      router.push("/game");
    }, 3000); // show loading for 3 sec
  };
  return (
    <div>
      {loading ? (
        <LoadPage title="Snake Game" loadingBarTitle="Preparing your Battle" />
      ) : (
        <StyledAuthform
          type="login"
          onSuccess={handleSuccess}
          onToggleType={() => router.push("/login")}
        />
      )}
    </div>
  );
}
