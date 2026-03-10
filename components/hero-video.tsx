"use client"

import { useRef, useState, useEffect } from "react"
import { Volume2, VolumeX } from "lucide-react"

export default function HeroVideo({ mp4 = '/hero-video-optimized.mp4', webm = '/hero-video.webm', poster = '' }: { mp4?: string, webm?: string, poster?: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted
  }, [muted])

  const toggleMute = () => {
    setMuted((m) => !m)
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
    }
  }

  return (
    <div className="absolute inset-0">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        loop
        playsInline
        muted={muted}
        poster={poster}
      >
        {webm && <source src={webm} type="video/webm" />}
        <source src={mp4} type="video/mp4" />
      </video>

      {/* overlay gradients to keep text readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/45 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />

      {/* mute button */}
      <button
        aria-label={muted ? "Activer le son" : "Couper le son"}
        onClick={toggleMute}
        className="absolute bottom-6 right-6 z-30 bg-white/80 text-gray-800 rounded-full p-3 shadow-lg hover:scale-105 transition-transform"
      >
        {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>
    </div>
  )
}
