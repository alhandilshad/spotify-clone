import { NextResponse } from "next/server"

export async function GET() {
  // Simulating playlist data
  const playlists = [
    {
      id: "1",
      name: "My Favorite Songs",
      songs: [
        { id: "1", title: "Song 1", artist: "Artist 1", album: "Album 1", duration: 180, url: "/song1.mp3" },
        { id: "2", title: "Song 2", artist: "Artist 2", album: "Album 2", duration: 210, url: "/song2.mp3" },
        { id: "3", title: "Song 3", artist: "Artist 3", album: "Album 3", duration: 195, url: "/song3.mp3" },
      ],
    },
    {
      id: "2",
      name: "Chill Vibes",
      songs: [
        { id: "4", title: "Song 4", artist: "Artist 4", album: "Album 4", duration: 200, url: "/song4.mp3" },
        { id: "5", title: "Song 5", artist: "Artist 5", album: "Album 5", duration: 225, url: "/song5.mp3" },
      ],
    },
  ]

  return NextResponse.json(playlists)
}