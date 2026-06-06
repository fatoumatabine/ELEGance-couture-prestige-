"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { normalizeImageUrl } from "@/lib/image-utils"

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isInteractive, setIsInteractive] = useState(false)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 })

  const goToPrevious = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    resetTilt()
  }

  const goToNext = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    resetTilt()
  }

  const displayImages = images.map(normalizeImageUrl).filter((image): image is string => Boolean(image))
  const resetTilt = () => setTilt({ rotateX: 0, rotateY: 0 })

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isInteractive) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    setTilt({
      rotateX: Math.max(-8, Math.min(8, y * -16)),
      rotateY: Math.max(-10, Math.min(10, x * 20)),
    })
  }

  const toggleInteractive = () => {
    setIsInteractive((active) => {
      if (active) resetTilt()
      return !active
    })
  }

  return (
    <div className="w-full max-w-[520px] justify-self-center space-y-4 lg:justify-self-start">
      <div
        className="relative flex aspect-[3/4] max-h-[680px] touch-none items-center justify-center overflow-hidden rounded-[12px] bg-white shadow-lg"
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
        style={{ perspective: "1100px" }}
      >
        {displayImages.length > 0 ? (
          <div
            className={`flex h-full w-full cursor-pointer items-center justify-center will-change-transform ${
              isInteractive ? "transition-transform duration-75" : "transition-transform duration-500"
            }`}
            onClick={toggleInteractive}
            style={{
              transform: isInteractive
                ? `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(1.08)`
                : "rotateX(0deg) rotateY(0deg) scale(1)",
              transformStyle: "preserve-3d",
              filter: isInteractive ? "drop-shadow(0 28px 34px rgba(24, 15, 8, 0.18))" : "none",
            }}
          >
            <img
              src={displayImages[currentIndex]}
              alt={`${productName} - Image ${currentIndex + 1}`}
              className="h-full w-full object-contain select-none"
              draggable={false}
            />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center px-8 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Image admin requise
          </div>
        )}

        {displayImages.length > 0 && (
          <Button
            variant="secondary"
            size="icon"
            className={`absolute right-4 top-4 z-10 h-9 w-9 rounded-full shadow-sm hover:bg-white ${
              isInteractive ? "bg-[#FF9D00] text-white hover:text-[#111827]" : "bg-white/95"
            }`}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleInteractive()
            }}
            aria-label={isInteractive ? "Désactiver la vue 3D" : "Activer la vue 3D"}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        )}

        {displayImages.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-3 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-white/95 shadow-sm hover:bg-white"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-3 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-white/95 shadow-sm hover:bg-white"
              onClick={goToNext}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}

        {displayImages.length > 0 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/65 px-3 py-1 text-xs text-white backdrop-blur-sm">
            {isInteractive ? "Vue 3D active" : `${currentIndex + 1} / ${displayImages.length}`}
          </div>
        )}
      </div>

      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index)
                setIsInteractive(false)
                resetTilt()
              }}
              className={`relative h-[72px] w-[72px] shrink-0 overflow-hidden border bg-white transition-colors ${
                currentIndex === index
                  ? "border-black"
                  : "border-gray-200 hover:border-gray-500"
              }`}
            >
              <img
                src={image}
                alt={`${productName} - Vignette ${index + 1}`}
                className="h-full w-full object-contain p-1.5"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
