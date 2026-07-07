"use client"

import { useEffect, useState } from "react"
import { Download, X } from "lucide-react"

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

function isStandaloneApp() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

export function PwaManager() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallButton, setShowInstallButton] = useState(false)

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return
    }

    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined)
    }

    if (document.readyState === "complete") {
      register()
      return
    }

    window.addEventListener("load", register, { once: true })

    return () => window.removeEventListener("load", register)
  }, [])

  useEffect(() => {
    if (isStandaloneApp()) {
      return
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as BeforeInstallPromptEvent)
      setShowInstallButton(true)
    }

    const handleInstalled = () => {
      setInstallPrompt(null)
      setShowInstallButton(false)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleInstalled)
    }
  }, [])

  const installApp = async () => {
    if (!installPrompt) {
      return
    }

    await installPrompt.prompt()
    await installPrompt.userChoice.catch(() => undefined)
    setInstallPrompt(null)
    setShowInstallButton(false)
  }

  if (!showInstallButton || !installPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-6 left-4 z-50 flex max-w-[calc(100vw-2rem)] items-center gap-1 rounded-md border border-[#ff9d00]/35 bg-[#180f08] p-1.5 text-[#fff8ed] shadow-[0_16px_36px_rgba(24,15,8,0.28)] md:bottom-7 md:left-7">
      <button
        type="button"
        onClick={installApp}
        className="inline-flex h-11 items-center gap-2 rounded-sm px-3 text-sm font-semibold transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#ff9d00]"
      >
        <Download className="h-4 w-4 shrink-0" />
        <span className="whitespace-nowrap">Installer l'app</span>
      </button>
      <button
        type="button"
        onClick={() => setShowInstallButton(false)}
        aria-label="Masquer"
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-sm transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#ff9d00]"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
