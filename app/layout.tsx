import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import StreakCounter from "@/components/StreakCounter";
import PerformanceMonitor from "@/components/PerformanceMonitor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "APA A Day",
  description: "\"Cite it right, sleep at night!\"",
  metadataBase: new URL('https://apa-a-day.vercel.app'),
  openGraph: {
    title: "APA A Day",
    description: "Cite it right, sleep at night!",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "APA A Day",
    description: "Cite it right, sleep at night!",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        <PerformanceMonitor />
        <div className="max-w-4xl mx-auto my-5 lg:my-8">
          <div className="max-w-lg mx-auto">
          <div className="w-full flex justify-end">
              <StreakCounter />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center md:pb-3">
            <h1 className="text-4xl font-semibold">APA-A-Day</h1>
            <h3 className="text-base italic text-gray-400">
              &quot;Cite it right, sleep at night!&quot;
            </h3>
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
