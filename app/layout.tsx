import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/components/language-provider"
import { WhatsappFloat } from "@/components/whatsapp-float"
import { PwaManager } from "@/components/pwa-manager"
import "./globals.css"

export const metadata: Metadata = {
  title: "Elegance Couture - Mode & Tradition Africaine",
  description: "Boutique en ligne de vêtements traditionnels africains, robes wax, boubous et complets sur mesure au Sénégal",
  applicationName: "Elegance Couture",
  generator: "v0.app",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Elegance Couture",
  },
  formatDetection: {
    telephone: true,
  },
  icons: {
    icon: [
      { url: "/logo-elegance-couture.svg", type: "image/svg+xml" },
      { url: "/logo.png", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preload" as="video" href="/hero-video-optimized.mp4" type="video/mp4" />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <LanguageProvider>
            {children}
            <WhatsappFloat />
            <PwaManager />
            <Toaster />
            <Analytics />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
