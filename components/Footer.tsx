import Link from "next/link";

export default function Footer() {
    return (
        <footer className="fixed bottom-0 w-full p-6">
            <div className="container mx-auto">
                <p className="text-center text-gray-600">
                    <Link href="https://github.com/makors/apa-a-day" className="underline">open source</Link> and made with ❤️
                </p>
            </div>
        </footer>
    )
}
