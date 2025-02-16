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
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        <div className="max-w-4xl mx-auto my-5 lg:my-8">
          <div className="max-w-lg mx-auto">
          <div className="w-full flex justify-end">
              <StreakCounter />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center md:pb-3">
            <h1 className="text-4xl font-semibold">APA-A-Day</h1>
            <h3 className="text-base italic text-gray-400">
              "Cite it right, sleep at night!"
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
