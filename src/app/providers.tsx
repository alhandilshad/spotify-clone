"use client"

import { createContext, useState, useContext, useEffect } from "react"
import { SessionProvider } from "next-auth/react"
import SpotifyWebApi from "spotify-web-api-node"
import axios from "axios"

const spotifyApi = new SpotifyWebApi({
  clientId: "e1860280c89b48798373f4d908985306",
})

console.log(spotifyApi, 'alhn')

type Song = SpotifyApi.TrackObjectFull

type User = {
  id: string
  name: string
  email: string
}

type SpotifyContextType = {
  user: User | null
  setUser: (user: User | null) => void
  currentSong: Song | null
  setCurrentSong: (song: Song | null) => void
  isPlaying: boolean
  setIsPlaying: (isPlaying: boolean) => void
  volume: number
  setVolume: (volume: number) => void
  spotifyApi: SpotifyWebApi
}

const SpotifyContext = createContext<SpotifyContextType | undefined>(undefined)

export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)

  console.log(currentSong)

  return (
    <SessionProvider>
      <SpotifyContext.Provider
        value={{
          user,
          setUser,
          currentSong,
          setCurrentSong,
          isPlaying,
          setIsPlaying,
          volume,
          setVolume,
          spotifyApi,
        }}
      >
        {children}
      </SpotifyContext.Provider>
    </SessionProvider>
  )
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext)
  if (context === undefined) {
    throw new Error("useSpotify must be used within a SpotifyProvider")
  }
  return context
}

