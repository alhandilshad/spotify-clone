"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { useEffect } from "react"
import { useSpotify } from "../providers"

export default function Auth() {
  const { data: session } = useSession()
  const { setUser } = useSpotify()

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id as string,
        name: session.user.name as string,
        email: session.user.email as string,
      })
    }
  }, [session, setUser])

  if (session) {
    return (
      <div className="flex items-center space-x-4">
        <p>Signed in as {session.user?.name}</p>
        <button
          onClick={() => signOut()}
          className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition"
        >
          Sign out
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => signIn("spotify")}
      className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition"
    >
      Sign in with Spotify
    </button>
  )
}