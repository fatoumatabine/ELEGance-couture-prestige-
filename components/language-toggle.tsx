"use client"

import { useLanguage, type Language } from "@/components/language-provider"

const languageLabels: Record<Language, string> = {
  fr: "Français",
  en: "English",
}

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <div
      className="inline-flex h-8 overflow-hidden border border-[#e0d5c5] bg-[#fff8ed]/70 text-[10px] font-bold uppercase tracking-[0.12em] dark:border-[#3b2717] dark:bg-[#211207]"
      aria-label="Choix de langue"
      title={languageLabels[language]}
    >
      {(["fr", "en"] as Language[]).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setLanguage(item)}
          className={`px-2.5 transition-colors ${
            language === item
              ? "bg-[#FF9D00] text-[#180f08]"
              : "text-[#7B542F] hover:bg-[#fff3dd] hover:text-[#B6771D] dark:text-[#d7ba8c] dark:hover:bg-[#2b190d]"
          }`}
          aria-pressed={language === item}
        >
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
