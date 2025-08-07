import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import StreakCounter from "@/components/StreakCounter";
import Link from "next/link";
import { Github } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "APA A Day",
  description: "\"Cite it right, sleep at night!\"",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black`}
      >
        {/* Background decorations */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03),rgba(0,0,0,0))]" />
        </div>

        {/* Header */}
        <header className="relative z-20 border-b border-gray-800/60 backdrop-blur supports-[backdrop-filter]:bg-gray-950/30">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-lg font-semibold bg-gradient-to-r from-gray-100 via-gray-300 to-orange-300 bg-clip-text text-transparent">APA-A-Day</span>
            </Link>
            <Link href="https://github.com/makors/apa-a-day" className="flex items-center gap-2 text-gray-400 hover:text-orange-300 transition-colors">
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">Star on GitHub</span>
            </Link>
          </div>
        </header>

        <div className="relative z-10 max-w-4xl mx-auto my-5 lg:my-8 px-4">
          <div className="max-w-lg mx-auto">
            <div className="w-full flex justify-end">
              <StreakCounter />
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center md:pb-6 mb-8">
            <div className="text-center space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-100 via-gray-300 to-orange-300 bg-clip-text text-transparent">
                APA-A-Day
              </h1>
              <div className="relative">
                <h3 className="text-lg md:text-xl italic text-gray-300 font-medium">
                  &quot;Cite it right, sleep at night!&quot;
                </h3>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full" />
              </div>
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                Master APA citation format one day at a time. Build your streak and become a citation expert!
              </p>
            </div>
          </div>
          
          <div className="max-w-lg mx-auto">
            {children}
          </div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
