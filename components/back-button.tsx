"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface BackButtonProps {
  className?: string
  fallbackHref?: string
  label?: string
  showLabel?: boolean
}

export function BackButton({
  className,
  fallbackHref = "/",
  label = "Retour",
  showLabel = true,
}: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back()
      return
    }

    router.push(fallbackHref)
  }

  return (
    <Button
      type="button"
      variant="ghost"
      className={cn(
        "h-10 rounded-full text-[#7B542F] hover:bg-[#fff3dd] hover:text-[#FF9D00] dark:text-[#d7ba8c] dark:hover:bg-[#211207]",
        showLabel ? "gap-2 px-3" : "w-10 px-0",
        className
      )}
      onClick={handleBack}
      aria-label={label}
      title={label}
    >
      <ArrowLeft className="h-4 w-4" />
      {showLabel && <span>{label}</span>}
    </Button>
  )
}
