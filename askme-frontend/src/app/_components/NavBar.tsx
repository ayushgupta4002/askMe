import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

function NavBar({session}:{session:any}) {
  return (
    <nav className="border-b z-[9999] sticky top-3 mx-6 h-[8vh] border-border/10 backdrop-blur-xl bg-black/70 rounded-2xl">
    <div className="max-w-full h-full px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-full">
        <div className="flex items-center space-x-2 group">
          {/* <div className="p-2 rounded-full bg-zinc-600/90 group-hover:bg-zinc-400/80 transition-all duration-300">
            <CodeIcon className="w-7 h-7 text-gray-200 group-hover:text-white transform rotate-12 group-hover:rotate-[-12] transition-all duration-300" />
          </div> */}
          <span className="text-3xl font-bold font-display bg-gradient-to-r from-white-700 to-blue-800 text-white bg-clip-text">
            askMe.in
          </span>
        </div>

        <div>
          {session && session.user ? (
            <Link href={"/dashboard/chat"}>
              <Button variant="default">Dashboard</Button>
            </Link>
          ) : (
            <>
              <Button variant="default" className="bg-transparent text-white hover:bg-white/10" onClick={() => signIn()}>
                SignIn
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  </nav>
  )
}

export default NavBar