"use client"

import type { ReactNode } from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

export type Language = "fr" | "en"

interface LanguageContextValue {
  language: Language
  setLanguage: (language: Language) => void
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("fr")
  const [languageLoaded, setLanguageLoaded] = useState(false)

  useEffect(() => {
    const savedLanguage = localStorage.getItem("siteLanguage")
    if (savedLanguage === "fr" || savedLanguage === "en") {
      setLanguageState(savedLanguage)
    }
    setLanguageLoaded(true)
  }, [])

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage)
  }

  useEffect(() => {
    if (!languageLoaded) return
    localStorage.setItem("siteLanguage", language)
    document.documentElement.lang = language
  }, [language, languageLoaded])

  const value = useMemo(() => ({ language, setLanguage }), [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider")
  }

  return context
}
