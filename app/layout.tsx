import type React from "react"
import type { Metadata } from "next"
import { Geist, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { WhatsappFloat } from "@/components/whatsapp-float"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _playfair = Playfair_Display({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Elegance Couture - Mode & Tradition Africaine",
  description: "Boutique en ligne de vêtements traditionnels africains, robes wax, boubous et complets sur mesure au Sénégal",
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/logo-elegance-couture.svg", type: "image/svg+xml" },
      { url: "/logo.png", type: "image/png" },
    ],
    apple: "/logo.png",
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
          {children}
          <WhatsappFloat />
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
