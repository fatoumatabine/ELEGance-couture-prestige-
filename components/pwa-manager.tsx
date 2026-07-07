"use client"

import { useEffect, useState } from "react"
import { Download, Share2, X } from "lucide-react"

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

type ManualInstallPlatform = "ios" | "android"

const DISMISSED_STORAGE_KEY = "elegance-couture-pwa-install-dismissed-at"
const DISMISS_DURATION_MS = 1000 * 60 * 60 * 24 * 14

function isStandaloneApp() {
  if (typeof window === "undefined") {
    return false
  }

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

function isIosLikeDevice() {
  const userAgent = window.navigator.userAgent.toLowerCase()
  const platform = window.navigator.platform
  const maxTouchPoints = window.navigator.maxTouchPoints || 0

  return /iphone|ipad|ipod/.test(userAgent) || (platform === "MacIntel" && maxTouchPoints > 1)
}

function isAndroidDevice() {
  return /android/.test(window.navigator.userAgent.toLowerCase())
}

function wasDismissedRecently() {
  try {
    const dismissedAt = window.localStorage.getItem(DISMISSED_STORAGE_KEY)

    if (!dismissedAt) {
      return false
    }

    return Date.now() - Number(dismissedAt) < DISMISS_DURATION_MS
  } catch {
    return false
  }
}

function rememberDismissal() {
  try {
    window.localStorage.setItem(DISMISSED_STORAGE_KEY, String(Date.now()))
  } catch {
    // Storage can be blocked in private mode. The UI can still be dismissed for this session.
  }
}

export function PwaManager() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallButton, setShowInstallButton] = useState(false)
  const [manualInstallPlatform, setManualInstallPlatform] = useState<ManualInstallPlatform | null>(null)

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
      setManualInstallPlatform(null)
      setInstallPrompt(event as BeforeInstallPromptEvent)

      if (!wasDismissedRecently()) {
        setShowInstallButton(true)
      }
    }

    const handleInstalled = () => {
      setInstallPrompt(null)
      setShowInstallButton(false)
      setManualInstallPlatform(null)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleInstalled)
    }
  }, [])

  useEffect(() => {
    if (isStandaloneApp() || installPrompt || showInstallButton || wasDismissedRecently()) {
      return
    }

    const timeout = window.setTimeout(() => {
      if (isStandaloneApp() || installPrompt) {
        return
      }

      if (isIosLikeDevice()) {
        setManualInstallPlatform("ios")
        return
      }

      if (isAndroidDevice()) {
        setManualInstallPlatform("android")
      }
    }, 1600)

    return () => window.clearTimeout(timeout)
  }, [installPrompt, showInstallButton])

  const installApp = async () => {
    if (!installPrompt) {
      return
    }

    await installPrompt.prompt()
    await installPrompt.userChoice.catch(() => undefined)
    setInstallPrompt(null)
    setShowInstallButton(false)
  }

  const dismissInstallMessage = () => {
    rememberDismissal()
    setShowInstallButton(false)
    setManualInstallPlatform(null)
  }

  if (showInstallButton && installPrompt) {
    return (
      <div className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-4 z-50 flex max-w-[calc(100vw-2rem)] items-center gap-1 rounded-md border border-[#ff9d00]/35 bg-[#180f08] p-1.5 text-[#fff8ed] shadow-[0_16px_36px_rgba(24,15,8,0.28)] md:bottom-7 md:left-7">
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
          onClick={dismissInstallMessage}
          aria-label="Masquer"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-sm transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#ff9d00]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  if (!manualInstallPlatform) {
    return null
  }

  const isIos = manualInstallPlatform === "ios"

  return (
    <div className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-3 z-50 max-w-[calc(100vw-1.5rem)] rounded-xl border border-[#ff9d00]/35 bg-[#180f08] p-3 text-[#fff8ed] shadow-[0_16px_36px_rgba(24,15,8,0.28)] min-[420px]:left-4 min-[420px]:max-w-[23rem] md:bottom-7 md:left-7">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ff9d00] text-[#180f08]">
          {isIos ? <Share2 className="h-4 w-4" /> : <Download className="h-4 w-4" />}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold">Installer l'app</p>
          <p className="mt-1 text-xs leading-relaxed text-[#fff8ed]/85">
            {isIos
              ? "Sur iPhone/iPad : ouvrez Safari, touchez Partager, puis « Sur l’écran d’accueil »."
              : "Sur Android : ouvrez le menu de Chrome, puis choisissez « Installer l’application » ou « Ajouter à l’écran d’accueil »."}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={dismissInstallMessage}
        aria-label="Masquer"
        className="absolute right-1.5 top-1.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#ff9d00]"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
