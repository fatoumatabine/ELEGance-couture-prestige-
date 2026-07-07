"use client"

import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent, PointerEvent, WheelEvent } from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, RotateCcw, X, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { normalizeImageUrl } from "@/lib/image-utils"

interface ProductGalleryProps {
  images: string[]
  productName: string
}

interface Point {
  x: number
  y: number
}

const INITIAL_ZOOM_SCALE = 2.4
const MIN_ZOOM_SCALE = 1
const MAX_ZOOM_SCALE = 4
const ZOOM_STEP = 0.4

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function getDistance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function getCenter(a: Point, b: Point) {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  }
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [inlineZoom, setInlineZoom] = useState({ active: false, x: 50, y: 50 })
  const [zoomOpen, setZoomOpen] = useState(false)
  const [zoomScale, setZoomScale] = useState(1)
  const [zoomOffset, setZoomOffset] = useState<Point>({ x: 0, y: 0 })

  const displayImages = useMemo(
    () => images.map(normalizeImageUrl).filter((image): image is string => Boolean(image)),
    [images]
  )
  const currentImage = displayImages[currentIndex]

  const activePointersRef = useRef(new Map<number, Point>())
  const panStartRef = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null)
  const pinchStartRef = useRef<{
    distance: number
    scale: number
    centerX: number
    centerY: number
    offsetX: number
    offsetY: number
  } | null>(null)
  const zoomScaleRef = useRef(zoomScale)
  const zoomOffsetRef = useRef(zoomOffset)

  const resetInlineZoom = useCallback(() => {
    setInlineZoom({ active: false, x: 50, y: 50 })
  }, [])

  const clampZoomOffset = useCallback((offset: Point, scale: number) => {
    if (typeof window === "undefined" || scale <= 1) {
      return { x: 0, y: 0 }
    }

    const maxX = window.innerWidth * (scale - 1) * 0.7
    const maxY = window.innerHeight * (scale - 1) * 0.7

    return {
      x: clamp(offset.x, -maxX, maxX),
      y: clamp(offset.y, -maxY, maxY),
    }
  }, [])

  const applyZoomState = useCallback(
    (scale: number, offset: Point = zoomOffsetRef.current) => {
      const nextScale = clamp(scale, MIN_ZOOM_SCALE, MAX_ZOOM_SCALE)
      const nextOffset = clampZoomOffset(offset, nextScale)

      zoomScaleRef.current = nextScale
      zoomOffsetRef.current = nextOffset
      setZoomScale(nextScale)
      setZoomOffset(nextOffset)
    },
    [clampZoomOffset]
  )

  const resetZoom = useCallback(
    (scale = 1) => {
      activePointersRef.current.clear()
      panStartRef.current = null
      pinchStartRef.current = null
      applyZoomState(scale, { x: 0, y: 0 })
    },
    [applyZoomState]
  )

  const openZoom = useCallback(() => {
    if (!currentImage) return

    resetInlineZoom()
    setZoomOpen(true)
    resetZoom(INITIAL_ZOOM_SCALE)
  }, [currentImage, resetInlineZoom, resetZoom])

  const closeZoom = useCallback(() => {
    setZoomOpen(false)
    resetZoom()
  }, [resetZoom])

  const updateZoomBy = useCallback(
    (delta: number) => {
      applyZoomState(zoomScaleRef.current + delta)
    },
    [applyZoomState]
  )

  const goToPrevious = useCallback(
    (e?: MouseEvent<HTMLButtonElement>) => {
      e?.preventDefault()
      e?.stopPropagation()

      setCurrentIndex((prev) => {
        if (displayImages.length === 0) return 0
        return prev === 0 ? displayImages.length - 1 : prev - 1
      })
      resetInlineZoom()
      resetZoom(zoomOpen ? INITIAL_ZOOM_SCALE : 1)
    },
    [displayImages.length, resetInlineZoom, resetZoom, zoomOpen]
  )

  const goToNext = useCallback(
    (e?: MouseEvent<HTMLButtonElement>) => {
      e?.preventDefault()
      e?.stopPropagation()

      setCurrentIndex((prev) => {
        if (displayImages.length === 0) return 0
        return prev === displayImages.length - 1 ? 0 : prev + 1
      })
      resetInlineZoom()
      resetZoom(zoomOpen ? INITIAL_ZOOM_SCALE : 1)
    },
    [displayImages.length, resetInlineZoom, resetZoom, zoomOpen]
  )

  const handleMainImagePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = clamp(((e.clientX - rect.left) / rect.width) * 100, 0, 100)
    const y = clamp(((e.clientY - rect.top) / rect.height) * 100, 0, 100)

    setInlineZoom({ active: true, x, y })
  }

  const handleMainImageKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      openZoom()
    }
  }

  const handleZoomPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)

    const point = { x: e.clientX, y: e.clientY }
    activePointersRef.current.set(e.pointerId, point)

    const activePointers = Array.from(activePointersRef.current.values())

    if (activePointers.length === 1) {
      panStartRef.current = {
        x: point.x,
        y: point.y,
        offsetX: zoomOffsetRef.current.x,
        offsetY: zoomOffsetRef.current.y,
      }
      pinchStartRef.current = null
      return
    }

    if (activePointers.length >= 2) {
      const [first, second] = activePointers
      const center = getCenter(first, second)

      pinchStartRef.current = {
        distance: getDistance(first, second),
        scale: zoomScaleRef.current,
        centerX: center.x,
        centerY: center.y,
        offsetX: zoomOffsetRef.current.x,
        offsetY: zoomOffsetRef.current.y,
      }
      panStartRef.current = null
    }
  }

  const handleZoomPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!activePointersRef.current.has(e.pointerId)) return

    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const activePointers = Array.from(activePointersRef.current.values())

    if (activePointers.length >= 2 && pinchStartRef.current) {
      const [first, second] = activePointers
      const center = getCenter(first, second)
      const nextScale = clamp(
        pinchStartRef.current.scale * (getDistance(first, second) / pinchStartRef.current.distance),
        MIN_ZOOM_SCALE,
        MAX_ZOOM_SCALE
      )
      const nextOffset = clampZoomOffset(
        {
          x: pinchStartRef.current.offsetX + center.x - pinchStartRef.current.centerX,
          y: pinchStartRef.current.offsetY + center.y - pinchStartRef.current.centerY,
        },
        nextScale
      )

      zoomScaleRef.current = nextScale
      zoomOffsetRef.current = nextOffset
      setZoomScale(nextScale)
      setZoomOffset(nextOffset)
      return
    }

    if (!panStartRef.current || zoomScaleRef.current <= 1) return

    const nextOffset = clampZoomOffset(
      {
        x: panStartRef.current.offsetX + e.clientX - panStartRef.current.x,
        y: panStartRef.current.offsetY + e.clientY - panStartRef.current.y,
      },
      zoomScaleRef.current
    )

    zoomOffsetRef.current = nextOffset
    setZoomOffset(nextOffset)
  }

  const handleZoomPointerEnd = (e: PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }

    activePointersRef.current.delete(e.pointerId)
    const activePointers = Array.from(activePointersRef.current.values())

    if (activePointers.length === 1) {
      const remainingPointer = activePointers[0]

      panStartRef.current = {
        x: remainingPointer.x,
        y: remainingPointer.y,
        offsetX: zoomOffsetRef.current.x,
        offsetY: zoomOffsetRef.current.y,
      }
      pinchStartRef.current = null
      return
    }

    panStartRef.current = null
    pinchStartRef.current = null
  }

  const handleZoomWheel = (e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault()
    updateZoomBy(e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP)
  }

  const toggleZoomLevel = () => {
    applyZoomState(zoomScaleRef.current > 1.1 ? 1 : INITIAL_ZOOM_SCALE, { x: 0, y: 0 })
  }

  useEffect(() => {
    zoomScaleRef.current = zoomScale
  }, [zoomScale])

  useEffect(() => {
    zoomOffsetRef.current = zoomOffset
  }, [zoomOffset])

  useEffect(() => {
    if (currentIndex >= displayImages.length) {
      setCurrentIndex(0)
    }
  }, [currentIndex, displayImages.length])

  useEffect(() => {
    if (!zoomOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeZoom()
      if (event.key === "ArrowLeft") goToPrevious()
      if (event.key === "ArrowRight") goToNext()
      if (event.key === "+" || event.key === "=") updateZoomBy(ZOOM_STEP)
      if (event.key === "-") updateZoomBy(-ZOOM_STEP)
      if (event.key === "0") resetZoom(INITIAL_ZOOM_SCALE)
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [closeZoom, goToNext, goToPrevious, resetZoom, updateZoomBy, zoomOpen])

  return (
    <div className="w-full max-w-[520px] justify-self-center space-y-4 lg:justify-self-start">
      <div
        className="relative flex aspect-[3/4] max-h-[680px] items-center justify-center overflow-hidden rounded-[12px] bg-white shadow-lg"
      >
        {displayImages.length > 0 ? (
          <div
            role="button"
            tabIndex={0}
            className="flex h-full w-full cursor-zoom-in touch-manipulation items-center justify-center transition-transform duration-300 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9D00] focus-visible:ring-offset-2"
            onClick={openZoom}
            onPointerMove={handleMainImagePointerMove}
            onPointerLeave={resetInlineZoom}
            onKeyDown={handleMainImageKeyDown}
            aria-label={`Agrandir ${productName}`}
            title="Agrandir"
          >
            <img
              src={displayImages[currentIndex]}
              alt={`${productName} - Image ${currentIndex + 1}`}
              className={`h-full w-full select-none object-contain will-change-transform ${
                inlineZoom.active ? "duration-75" : "duration-300"
              } transition-transform`}
              draggable={false}
              style={{
                transform: inlineZoom.active ? "scale(2.35)" : "scale(1)",
                transformOrigin: `${inlineZoom.x}% ${inlineZoom.y}%`,
              }}
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
              zoomOpen ? "bg-[#FF9D00] text-white hover:text-[#111827]" : "bg-white/95"
            }`}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              openZoom()
            }}
            aria-label="Agrandir l'image"
            title="Agrandir"
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
            {currentIndex + 1} / {displayImages.length}
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
                resetInlineZoom()
                resetZoom()
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

      {zoomOpen && currentImage && (
        <div
          className="fixed inset-0 z-[100] bg-[#120b06]/95 text-white"
          role="dialog"
          aria-modal="true"
          aria-label={`Zoom ${productName}`}
        >
          <div className="absolute right-4 top-4 z-20 flex gap-2 sm:right-6 sm:top-6">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="h-10 w-10 rounded-full bg-white/95 text-[#180f08] shadow-lg hover:bg-white"
              onClick={() => updateZoomBy(-ZOOM_STEP)}
              aria-label="Réduire le zoom"
              title="Réduire"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="h-10 w-10 rounded-full bg-white/95 text-[#180f08] shadow-lg hover:bg-white"
              onClick={() => resetZoom(INITIAL_ZOOM_SCALE)}
              aria-label="Réinitialiser le zoom"
              title="Réinitialiser"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="h-10 w-10 rounded-full bg-white/95 text-[#180f08] shadow-lg hover:bg-white"
              onClick={() => updateZoomBy(ZOOM_STEP)}
              aria-label="Augmenter le zoom"
              title="Agrandir"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="h-10 w-10 rounded-full bg-white/95 text-[#180f08] shadow-lg hover:bg-white"
              onClick={closeZoom}
              aria-label="Fermer"
              title="Fermer"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div
            className={`flex h-full w-full touch-none items-center justify-center overflow-hidden px-4 py-20 ${
              zoomScale > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
            }`}
            onPointerDown={handleZoomPointerDown}
            onPointerMove={handleZoomPointerMove}
            onPointerUp={handleZoomPointerEnd}
            onPointerCancel={handleZoomPointerEnd}
            onWheel={handleZoomWheel}
            onDoubleClick={toggleZoomLevel}
          >
            <img
              src={currentImage}
              alt={`${productName} - Zoom ${currentIndex + 1}`}
              className="max-h-full max-w-full select-none object-contain will-change-transform"
              draggable={false}
              style={{
                transform: `translate3d(${zoomOffset.x}px, ${zoomOffset.y}px, 0) scale(${zoomScale})`,
                transformOrigin: "center center",
              }}
            />
          </div>

          {displayImages.length > 1 && (
            <>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute left-4 top-1/2 z-20 h-11 w-11 -translate-y-1/2 rounded-full bg-white/95 text-[#180f08] shadow-lg hover:bg-white sm:left-6"
                onClick={goToPrevious}
                aria-label="Image précédente"
                title="Précédent"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute right-4 top-1/2 z-20 h-11 w-11 -translate-y-1/2 rounded-full bg-white/95 text-[#180f08] shadow-lg hover:bg-white sm:right-6"
                onClick={goToNext}
                aria-label="Image suivante"
                title="Suivant"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}

          <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs text-white backdrop-blur-sm">
            {currentIndex + 1} / {displayImages.length}
          </div>
        </div>
      )}
    </div>
  )
}
