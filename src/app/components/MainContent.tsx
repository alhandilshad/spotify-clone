"use client"

import { useState, useEffect } from "react"
import { useSpotify } from "../providers"
import { Search, Loader } from "lucide-react"
import { useSession } from "next-auth/react"

export default function MainContent() {
  const { setCurrentSong, spotifyApi } = useSpotify()
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<SpotifyApi.TrackObjectFull[]>([])
  const [savedTracks, setSavedTracks] = useState<SpotifyApi.SavedTrackObject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    if (session && session.accessToken) {
      spotifyApi.setAccessToken(session.accessToken as string)
      fetchSavedTracks()
    }
  }, [session, spotifyApi])

  const fetchSavedTracks = async () => {
    try {
      setIsLoading(true)
      const data = await spotifyApi.getMySavedTracks({ limit: 50 })
      setSavedTracks(data.body.items)
    } catch (error) {
      console.error("Error fetching saved tracks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm) {
      setIsLoading(true)
      try {
        const results = await spotifyApi.searchTracks(searchTerm)
        console.log(results.body.tracks?.items, 'alhan');
        setSearchResults(results.body.tracks?.items || [])
      } catch (error) {
        console.error("Error searching tracks:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const playSong = (song: SpotifyApi.TrackObjectFull) => {
    setCurrentSong(song)
    spotifyApi.play({
      uris: [song.uri],
    })
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for songs, artists, or playlists"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 text-white rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </form>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin text-green-500" size={48} />
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">Your Library</h2>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-2 px-4 text-left">#</th>
                  <th className="py-2 px-4 text-left">Title</th>
                  <th className="py-2 px-4 text-left">Artist</th>
                  <th className="py-2 px-4 text-left">Album</th>
                  <th className="py-2 px-4 text-left">Duration</th>
                </tr>
              </thead>
              <tbody>
                {savedTracks.map((savedTrack, index) => {
                  const track = savedTrack.track
                  return (
                    <tr
                      key={track.id}
                      className="border-b border-gray-700 hover:bg-gray-700 transition cursor-pointer"
                      onClick={() => playSong(track)}
                    >
                      <td className="py-2 px-4">{index + 1}</td>
                      <td className="py-2 px-4">{track.name}</td>
                      <td className="py-2 px-4">{track.artists[0].name}</td>
                      <td className="py-2 px-4">{track.album.name}</td>
                      <td className="py-2 px-4">
                        {Math.floor(track.duration_ms / 60000)}:
                        {((track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, "0")}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {searchResults.length > 0 && (
            <>
              <h2 className="text-2xl font-bold mt-8 mb-4">Search Results</h2>
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="py-2 px-4 text-left">#</th>
                      <th className="py-2 px-4 text-left">Title</th>
                      <th className="py-2 px-4 text-left">Artist</th>
                      <th className="py-2 px-4 text-left">Album</th>
                      <th className="py-2 px-4 text-left">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((song, index) => (
                      <tr
                        key={song.id}
                        className="border-b border-gray-700 hover:bg-gray-700 transition cursor-pointer"
                        onClick={() => playSong(song)}
                      >
                        <td className="py-2 px-4">{index + 1}</td>
                        <td className="py-2 px-4">{song.name}</td>
                        <td className="py-2 px-4">{song.artists[0].name}</td>
                        <td className="py-2 px-4">{song.album.name}</td>
                        <td className="py-2 px-4">
                          {Math.floor(song.duration_ms / 60000)}:
                          {((song.duration_ms % 60000) / 1000).toFixed(0).padStart(2, "0")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

