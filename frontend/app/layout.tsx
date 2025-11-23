import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Space_Grotesk, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { RootProvider } from "./rootProvider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _spaceGrotesk = Space_Grotesk({ subsets: ["latin"] })
const _jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Wifi-Radar | Trustless Connectivity Verification",
  description: "Map-based WiFi signal verification powered by Web3. Discover, verify, and earn rewards for connectivity data.",
  openGraph: {
    title: "Wifi-Radar | Trustless Connectivity Verification",
    description: "Map-based WiFi signal verification powered by Web3. Discover, verify, and earn rewards for connectivity data.",
    images: [
      {
        url: "/logo_verifi.png",
        width: 1200,
        height: 630,
        alt: "Wifi-Radar",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wifi-Radar | Trustless Connectivity Verification",
    description: "Map-based WiFi signal verification powered by Web3. Discover, verify, and earn rewards for connectivity data.",
    images: ["/logo_verifi.png"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: "cover",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Wifi-Radar",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/logo_verifi.png",
        type: "image/png",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <RootProvider>
      <html lang="en">
        <body className={`font-sans antialiased`}>
          {children}
          <Toaster />
          <Analytics />
        </body>
      </html>
    </RootProvider>
  )
}
