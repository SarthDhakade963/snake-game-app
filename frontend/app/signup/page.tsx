"use client";
import LoadingPage from "@/components/LoadingPage";
import dynamic from "next/dynamic";

const StyledAuthform = dynamic(
  () => import("@/components/StyledAuthform").then((mod) => mod.StyledAuthform),
  { ssr: false }
);
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSuccess = () => {
    setLoading(true);
    setTimeout(() => {
      router.push("/game");
    }, 3000); // 3 sec delay
  };

  return (
    <div>
      {loading ? (
        <LoadingPage
          title="Snake Game"
          loadingBarTitle="Preparing your battlefield"
        />
      ) : (
        <StyledAuthform
          type="signup"
          onToggleType={() => router.push("/login")}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
