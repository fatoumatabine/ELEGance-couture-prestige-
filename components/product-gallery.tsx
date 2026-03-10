"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  const goToPrevious = (e: React.MouseEvent) => {
    e.preventDefault()
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = (e: React.MouseEvent) => {
    e.preventDefault()
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  // Use placeholder if no images
  const displayImages = images.length > 0 ? images : ["/placeholder.svg"]

  return (
    <div className="space-y-4">
      {/* Main Image - Version Premium */}
      <div className="relative aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
        <div 
          className={`w-full h-full transition-transform duration-500 ${isZoomed ? 'scale-150 cursor-zoom-out' : ''}`}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <img
            src={displayImages[currentIndex]?.replace('http://', 'https://') || "/placeholder.svg"}
            alt={`${productName} - Image ${currentIndex + 1}`}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Zoom Button */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 right-4 rounded-full shadow-lg bg-white/90 hover:bg-white z-10"
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <ZoomIn className="h-5 w-5" />
        </Button>

        {/* Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full shadow-lg bg-white/90 hover:bg-white h-12 w-12"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full shadow-lg bg-white/90 hover:bg-white h-12 w-12"
              onClick={goToNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-1.5 rounded-full text-sm backdrop-blur-sm">
          {currentIndex + 1} / {displayImages.length}
        </div>
      </div>

      {/* Thumbnails - Version Premium */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index)
                setIsZoomed(false)
              }}
              className={`relative aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                currentIndex === index 
                  ? "border-amber-500 shadow-md ring-2 ring-amber-500/20" 
                  : "border-transparent hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              <img
                src={image?.replace('http://', 'https://') || "/placeholder.svg"}
                alt={`${productName} - Vignette ${index + 1}`}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
