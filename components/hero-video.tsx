"use client"

import { useRef, useState, useEffect } from "react"
import { Volume2, VolumeX } from "lucide-react"

export default function HeroVideo({ mp4 = '/hero-video.mp4', webm = '', poster = '' }: { mp4?: string, webm?: string, poster?: string }) {
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
    <div className="absolute inset-0 overflow-hidden bg-[#120b06]">
      <video
        aria-hidden="true"
        className="absolute inset-0 h-full w-full scale-110 object-cover opacity-80 blur-xl"
        autoPlay
        loop
        playsInline
        muted
        preload="auto"
        poster={poster}
      >
        <source src={mp4} type="video/mp4" />
      </video>

      <video
        ref={videoRef}
        className="relative z-[1] h-full w-full object-cover"
        autoPlay
        loop
        playsInline
        muted={muted}
        preload="auto"
        poster={poster}
      >
        <source src={mp4} type="video/mp4" />
        {webm && <source src={webm} type="video/webm" />}
      </video>

      {/* overlay gradients to keep text readable */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-black/50 via-black/28 to-black/20" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/10 via-transparent to-black/35" />

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
