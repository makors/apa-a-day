import Link from "next/link";
import { Github } from "lucide-react";

export default function HeaderBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-800/60 backdrop-blur supports-[backdrop-filter]:bg-gray-950/30">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold bg-gradient-to-r from-gray-100 via-gray-300 to-orange-300 bg-clip-text text-transparent">APA-A-Day</span>
        </Link>
        <Link href="https://github.com/makors/apa-a-day" className="flex items-center gap-2 text-gray-400 hover:text-orange-300 transition-colors">
          <Github className="w-4 h-4" />
          <span className="hidden sm:inline">Star on GitHub</span>
        </Link>
      </div>
    </header>
  );
}