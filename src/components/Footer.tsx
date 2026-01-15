import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full border-t border-zinc-800 bg-zinc-950/50 py-6 backdrop-blur-sm mt-auto">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-sm text-zinc-500 md:flex-row">
                <p>&copy; {new Date().getFullYear()} YouTube Subscription Manager</p>
                <div className="flex gap-6">
                    <Link href="/terms" className="hover:text-zinc-300 transition-colors">
                        Terms of Service
                    </Link>
                    <Link href="/privacy" className="hover:text-zinc-300 transition-colors">
                        Privacy Policy
                    </Link>
                </div>
            </div>
        </footer>
    );
}
