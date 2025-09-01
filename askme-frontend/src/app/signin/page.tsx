// frontend/src/components/signIn/GoogleSignInButton.tsx

"use client";

import { signIn } from "next-auth/react";

import { ArrowRight, Code2, LogIn, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function Page() {
  const handleGuestLogin = () => {
    signIn("guest", { callbackUrl: "/dashboard/chat" });
  };
  return (
    <div className="min-h-screen  bg-gradient-to-b from-[hsl(0,0%,13%)] to-black flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 300 + 50 + "px",
                height: Math.random() * 300 + 50 + "px",
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
                background: `radial-gradient(circle, rgba(99,102,241,0.1) 0%, rgba(99,102,241,0) 70%)`,
                animation: `float ${Math.random() * 10 + 10}s infinite linear`,
              }}
            />
          ))}
        </div>
      </div>

      <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border-white/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10" />
        <div className="relative p-8">
          <div className="flex justify-center mb-8">
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/20">
              <Code2 className="w-10 h-10 text-white-400" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-white mb-2">
            Welcome to askMe.com
          </h1>
          <p className="text-center text-slate-300 mb-8">
            Your Voice Online
          </p>

          <Button
            variant="outline"
            className="w-full bg-white/5 hover:bg-white/10 backdrop-blur-sm border-white/20 text-white hover:text-white transition-all duration-300"
            onClick={() => signIn("google")}
          >
            <div className="flex items-center justify-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </div>
          </Button>

          
          {/* <Button
            variant="outline"
            className="w-full bg-white/5 mt-2 hover:bg-white/10 backdrop-blur-sm border-white/20 text-white hover:text-white transition-all duration-300"
            onClick={() => handleGuestLogin()}
          >
            <div className="flex items-center justify-center gap-5">

            <LogIn className="w-6 h-6" />

              Sign in as a Guest
            </div>
          </Button> */}

          

          {/* <div className="mt-8 flex items-center gap-2 justify-center text-slate-400">
            <Terminal className="w-4 h-4" />
            <p className="text-sm">Access your snippets anywhere</p>
          </div> */}
        </div>
      </Card>
    </div>
  );
}

export default Page;
