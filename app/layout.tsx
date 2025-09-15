import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "MediCare Hospital Management System",
  description: "Comprehensive hospital management system for bed management, OPD queue management, and patient care",
  generator: "v0.app",
  keywords: ["hospital", "management", "healthcare", "patient", "bed", "OPD", "queue"],
  authors: [{ name: "MediCare Hospital" }],
  creator: "MediCare Hospital",
  publisher: "MediCare Hospital",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://medicare-hospital.vercel.app"),
  openGraph: {
    title: "MediCare Hospital Management System",
    description: "Comprehensive hospital management system for bed management, OPD queue management, and patient care",
    url: "https://medicare-hospital.vercel.app",
    siteName: "MediCare Hospital",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MediCare Hospital Management System",
    description: "Comprehensive hospital management system for bed management, OPD queue management, and patient care",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={null}>
          {children}
          <Toaster />
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
