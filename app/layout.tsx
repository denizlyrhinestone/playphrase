import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster" // Re-add Toaster

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Playphrase.org Admin", // Updated title
  description: "Admin panel for Playphrase.org video content automation.", // Updated description
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <Toaster /> {/* Toaster re-added */}
        </ThemeProvider>
      </body>
    </html>
  )
}
