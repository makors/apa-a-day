import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import StreakCounter from "@/components/StreakCounter";

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
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto my-5 lg:my-8 px-4">
          <div className="max-w-lg mx-auto">
            <div className="w-full flex justify-end">
              <StreakCounter />
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center md:pb-6 mb-8">
            <div className="text-center space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-orange-500 bg-clip-text text-transparent animate-pulse">
                APA-A-Day
              </h1>
              <div className="relative">
                <h3 className="text-lg md:text-xl italic text-gray-300 font-medium">
                  &quot;Cite it right, sleep at night!&quot;
                </h3>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
              </div>
              <p className="text-sm text-gray-400 max-w-md">
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
