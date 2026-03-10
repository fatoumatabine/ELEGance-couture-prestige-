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
      <button className="w-8 h-8 flex items-center justify-center text-[#9e9585]">
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
          ? "border-[#2a2520] text-[#9e9585] hover:text-[#C9A96E] hover:border-[#C9A96E]"
          : "border-[#e0d5c5] text-[#6b5c47] hover:text-[#a8854a] hover:border-[#C9A96E]"
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
