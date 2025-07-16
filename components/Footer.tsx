import Link from "next/link";
import { Heart, Github } from "lucide-react";

export default function Footer() {
    return (
        <footer className="fixed bottom-0 w-full p-4 z-40">
            <div className="container mx-auto">
                <div className="flex items-center justify-center gap-2 text-gray-400 hover:text-gray-300 transition-colors">
                    <Link 
                        href="https://github.com/makors/apa-a-day" 
                        className="flex items-center gap-2 hover:text-orange-400 transition-colors group"
                    >
                        <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="underline">open source</span>
                    </Link>
                    <span>and made with</span>
                    <Heart className="w-4 h-4 text-red-400 animate-pulse" />
                </div>
            </div>
        </footer>
    )
}
