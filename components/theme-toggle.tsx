"use client"

import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button className="w-8 h-8 flex items-center justify-center text-[#d7ba8c]">
        <span className="w-3.5 h-3.5" />
      </button>
    )
  }

  const isDark = theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`w-8 h-8 flex items-center justify-center transition-colors duration-200 border ${
        isDark
          ? "border-[#3b2717] text-[#d7ba8c] hover:text-[#FF9D00] hover:border-[#FF9D00]"
          : "border-[#e0d5c5] text-[#7B542F] hover:text-[#B6771D] hover:border-[#FF9D00]"
      }`}
      aria-label={isDark ? "Mode clair" : "Mode sombre"}
      title={isDark ? "Mode clair" : "Mode sombre"}
    >
      {isDark ? (
        <Sun className="w-3.5 h-3.5" />
      ) : (
        <Moon className="w-3.5 h-3.5" />
      )}
    </button>
  )
}
