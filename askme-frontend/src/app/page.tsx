"use client";
import { Button } from "@/components/ui/button";
import {

  Coffee,
} from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import NavBar from "./_components/NavBar";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(0,29%,97%)] to-[hsl(230,100%,95%)]">
   <NavBar session={session}/>
      <main className="h-[92vh] mt-5 bg-gradient-to-b from-[hsl(0,29%,97%)] to-[hsl(230,100%,95%)]   flex flex-col justify-center">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-25">

          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8">
            <div className="text-left md:w-1/2">
              <h1 className="text-6xl text-black font-bold flex flex-row items-end space-x-4 font-font1 tracking-tight animate-slidein300 mb-6">
                <span> askMe.in </span>{" "}
                <Coffee size={45} className="p-1 max-sm:hidden" />
              </h1>
              <p className="text-xl font-font1 text-muted max-w-2xl animate-slidein500 mb-12">
              {/* We Gather Your Story – So that you can tell it anytime! */}
          The teacher who never gets tired of your questions.
              </p>
              <Link href="/dashboard/chat">
                <Button
                  size="lg"
                  className="animate-slidein700 bg-gradient-to-r text-white from-gray-500 to-gray-800"
                >
                  Get Started Now
                </Button>
              </Link>
            </div>

            <div className="md:w-1/2">
              <Image
                src="/hero.png"
                alt="header"
                width={600}
                height={600}
                className="w-full max-w-[600px] mx-auto object-center rounded-sm transition-all duration-200"
              />
            </div>
          </div>
        </div>
      </main>

  


      {/* <Footer /> */}
    </div>
  );
}
