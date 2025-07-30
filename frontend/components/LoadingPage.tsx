"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card } from "./ui/card";

interface LoadingPageProps {
  title: string;
  loadingBarTitle: string;
}

const LoadPage: React.FC<LoadingPageProps> = ({ title, loadingBarTitle }) => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/game");
    }, 10000000); // Delay before navigating

    return () => clearTimeout(timer);
  });

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100">
      {/* Heading Section */}
      <h1 className="text-6xl font-extrabold text-green-700 drop-shadow-lg font-[cursive] tracking-widest mb-20">
        {title}
      </h1>
      <Card className="h-screen max-h-50 w-full max-w-sm flex flex-col items-center justify-center bg-green-500">
        <div className="flex flex-col items-center gap-2 justify-center">
          {/* Loading Text */}
          <div className="text-yellow-400 text-3xl font-semibold ml-2 mb-5">
            {loadingBarTitle}
            <span className="ml-1 animate-blink">.</span>
            <span className="ml-1 animate-blink delay-[0.3s]">.</span>
            <span className="ml-1 animate-blink delay-[0.6s]">.</span>
          </div>
          {/* Loading Bar Container */}
          <div className="w-[200px] h-[30px] bg-neutral-900 rounded-full p-[5px] shadow-inner shadow-black">
            <div className="relative flex justify-center items-center w-0 h-[20px] rounded-full overflow-hidden bg-gradient-to-b from-orange-600 to-yellow-300 animate-loadingBar">
              {/* White Bars */}
              <div className="absolute flex items-center gap-[18px]">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="w-[10px] h-[45px] opacity-30 rotate-45 bg-gradient-to-tr from-white to-transparent"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoadPage;
