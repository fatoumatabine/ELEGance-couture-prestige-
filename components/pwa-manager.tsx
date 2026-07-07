"use client"

import { useEffect, useState } from "react"
import { ChevronRight, Download, Share2, X } from "lucide-react"

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

function isIosSafari() {
  const userAgent = window.navigator.userAgent.toLowerCase()

  return (
    isIosLikeDevice() &&
    /safari/.test(userAgent) &&
    !/crios|fxios|edgios|instagram|fbav|fban/.test(userAgent)
  )
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
  const [manualInstallCollapsed, setManualInstallCollapsed] = useState(false)

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
      setManualInstallCollapsed(false)
      setInstallPrompt(event as BeforeInstallPromptEvent)

      if (!wasDismissedRecently()) {
        setShowInstallButton(true)
      }
    }

    const handleInstalled = () => {
      setInstallPrompt(null)
      setShowInstallButton(false)
      setManualInstallPlatform(null)
      setManualInstallCollapsed(false)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleInstalled)
    }
  }, [])

  useEffect(() => {
    if (isStandaloneApp() || installPrompt || showInstallButton) {
      return
    }

    const timeout = window.setTimeout(() => {
      if (isStandaloneApp() || installPrompt) {
        return
      }

      if (isIosLikeDevice()) {
        setManualInstallPlatform("ios")
        setManualInstallCollapsed(true)
        return
      }

      if (isAndroidDevice()) {
        setManualInstallPlatform("android")
        setManualInstallCollapsed(true)
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
    setManualInstallCollapsed(true)
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
  const isSafari = isIos ? isIosSafari() : false

  if (manualInstallCollapsed) {
    return (
      <button
        type="button"
        onClick={() => setManualInstallCollapsed(false)}
        className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-3 z-50 inline-flex h-11 items-center gap-2 rounded-full border border-[#ff9d00]/40 bg-[#180f08] px-4 text-xs font-bold uppercase tracking-[0.12em] text-[#fff8ed] shadow-[0_12px_30px_rgba(24,15,8,0.26)] transition-colors hover:border-[#ff9d00] md:bottom-5 md:left-5"
      >
        {isIos ? <Share2 className="h-4 w-4" /> : <Download className="h-4 w-4" />}
        Installer
      </button>
    )
  }

  return (
    <div
      role="dialog"
      aria-label="Aide pour installer l'application"
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-[90] w-[min(calc(100vw-1.5rem),28rem)] -translate-x-1/2 rounded-2xl border border-[#ff9d00]/40 bg-[#180f08] p-4 pr-11 text-[#fff8ed] shadow-[0_22px_60px_rgba(24,15,8,0.36)] md:bottom-6"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ff9d00] text-[#180f08]">
          {isIos ? <Share2 className="h-4 w-4" /> : <Download className="h-4 w-4" />}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold">Installer l'app</p>
          {isIos ? (
            <div className="mt-1 space-y-1.5 text-xs leading-relaxed text-[#fff8ed]/85">
              <p className="rounded-md border border-[#ff9d00]/25 bg-[#ff9d00]/10 px-2 py-1 text-[#ffcf71]">
                iOS n’ouvre pas de popup d’installation. Il faut passer par le bouton Partager de Safari.
              </p>
              {!isSafari && (
                <p className="rounded-md border border-[#ff9d00]/25 bg-[#ff9d00]/10 px-2 py-1 text-[#ffcf71]">
                  Sur iPhone/iPad, ouvrez d'abord ce site dans Safari.
                </p>
              )}
              {[
                "Touchez le bouton Partager de Safari.",
                "Choisissez « Sur l’écran d’accueil ».",
                "Validez avec « Ajouter ».",
              ].map((step) => (
                <p key={step} className="flex gap-2">
                  <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#ff9d00]" />
                  <span>{step}</span>
                </p>
              ))}
            </div>
          ) : (
            <p className="mt-1 text-xs leading-relaxed text-[#fff8ed]/85">
              Sur Android : ouvrez le menu de Chrome, puis choisissez « Installer l’application » ou « Ajouter à l’écran d’accueil ».
            </p>
          )}
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
