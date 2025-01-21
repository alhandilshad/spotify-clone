"use client"

import { useSpotify } from "../providers"
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export default function Player() {
  const { currentSong, isPlaying, setIsPlaying, volume, setVolume, spotifyApi } = useSpotify()
  const { data: session } = useSession()
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    if (session && session.accessToken) {
      spotifyApi.setAccessToken(session.accessToken as string)
    }
  }, [session, spotifyApi])

  useEffect(() => {
    if (currentSong) {
      setDuration(currentSong.duration_ms / 1000)
      setProgress(0)
    }
  }, [currentSong])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isPlaying && currentSong) {
      timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= duration) {
            clearInterval(timer)
            return duration
          }
          return prevProgress + 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isPlaying, currentSong, duration])

  const togglePlay = async () => {
    if (currentSong) {
      try {
        if (isPlaying) {
          await spotifyApi.pause()
        } else {
          await spotifyApi.play()
        }
        setIsPlaying(!isPlaying)
      } catch (error) {
        console.error("Error toggling playback:", error)
      }
    }
  }

  const handleVolumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    try {
      await spotifyApi.setVolume(Math.round(newVolume * 100))
    } catch (error) {
      console.error("Error setting volume:", error)
    }
  }

  const handleSkipNext = async () => {
    try {
      await spotifyApi.skipToNext()
      const currentlyPlaying = await spotifyApi.getMyCurrentPlayingTrack()
      if (currentlyPlaying.body && currentlyPlaying.body.item) {
        setCurrentSong(currentlyPlaying.body.item as SpotifyApi.TrackObjectFull)
      }
    } catch (error) {
      console.error("Error skipping to next track:", error)
    }
  }

  const handleSkipPrevious = async () => {
    try {
      await spotifyApi.skipToPrevious()
      const currentlyPlaying = await spotifyApi.getMyCurrentPlayingTrack()
      if (currentlyPlaying.body && currentlyPlaying.body.item) {
        setCurrentSong(currentlyPlaying.body.item as SpotifyApi.TrackObjectFull)
      }
    } catch (error) {
      console.error("Error skipping to previous track:", error)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="bg-gray-900 border-t border-gray-800 p-4 flex items-center justify-between">
      <div className="flex items-center w-1/3">
        {currentSong && (
          <>
            <img
              src={currentSong.album.images[0].url || "/placeholder.svg"}
              alt={currentSong.name}
              className="w-16 h-16 mr-4"
            />
            <div>
              <h3 className="font-semibold">{currentSong.name}</h3>
              <p className="text-gray-400 text-sm">{currentSong.artists[0].name}</p>
            </div>
          </>
        )}
      </div>
      <div className="flex flex-col items-center w-1/3">
        <div className="flex items-center mb-2">
          <button className="text-gray-400 hover:text-white mr-4" onClick={handleSkipPrevious}>
            <SkipBack />
          </button>
          <button className="bg-white text-black rounded-full p-2 hover:scale-105 transition" onClick={togglePlay}>
            {isPlaying ? <Pause /> : <Play />}
          </button>
          <button className="text-gray-400 hover:text-white ml-4" onClick={handleSkipNext}>
            <SkipForward />
          </button>
        </div>
        <div className="w-full flex items-center">
          <span className="text-xs text-gray-400 mr-2">{formatTime(progress)}</span>
          <div className="flex-1 bg-gray-600 rounded-full h-1">
            <div className="bg-white h-1 rounded-full" style={{ width: `${(progress / duration) * 100}%` }}></div>
          </div>
          <span className="text-xs text-gray-400 ml-2">{formatTime(duration)}</span>
        </div>
      </div>
      <div className="flex items-center justify-end w-1/3">
        <Volume2 className="mr-2 text-gray-400" />
        <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} className="w-24" />
      </div>
    </div>
  )
}

