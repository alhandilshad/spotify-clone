"use client"

import { Home, Search, Library, PlusSquare } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useSpotify } from "../providers"

export default function Sidebar() {
  const { playlists, setPlaylists, spotifyApi } = useSpotify()
  const { data: session } = useSession()

  useEffect(() => {
    if (session && session.accessToken) {
      spotifyApi.setAccessToken(session.accessToken);
      spotifyApi.getUserPlaylists().then((data) => {
        console.log(data.body, 'alhan'); // Inspect the API response
        // setPlaylists(data.body.items);
      }).catch((error) => {
        console.error("Spotify API Error:", error);
      });
    }
  }, [session, spotifyApi, setPlaylists]);
  

  return (
    <div className="w-64 bg-black p-6 flex flex-col h-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Spotify Clone</h1>
      </div>
      <nav className="mb-8">
        <ul className="space-y-4">
          <li>
            <Link href="/" className="flex items-center text-gray-400 hover:text-white">
              <Home className="mr-4" />
              Home
            </Link>
          </li>
          <li>
            <Link href="/search" className="flex items-center text-gray-400 hover:text-white">
              <Search className="mr-4" />
              Search
            </Link>
          </li>
          <li>
            <Link href="/library" className="flex items-center text-gray-400 hover:text-white">
              <Library className="mr-4" />
              Your Library
            </Link>
          </li>
        </ul>
      </nav>
      <div className="mb-8">
        <button className="flex items-center text-gray-400 hover:text-white">
          <PlusSquare className="mr-4" />
          Create Playlist
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
  <h2 className="text-lg font-semibold mb-4 text-white">Playlists</h2>
  {playlists?.length > 0 ? (
    <ul className="space-y-2">
      {playlists?.map((playlist) => (
        <li key={playlist.id}>
          <Link href={`/playlist/${playlist.id}`} className="text-gray-400 hover:text-white">
            {playlist.name}
          </Link>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-500">No playlists found.</p>
  )}
</div>

    </div>
  )
}