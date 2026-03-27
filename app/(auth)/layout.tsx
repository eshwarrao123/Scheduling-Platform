import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Minimal top bar */}
            <header className="px-6 h-14 flex items-center border-b border-white/5">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <svg
                            className="w-3.5 h-3.5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                    <span className="text-white font-semibold text-base">Schedula</span>
                </Link>
            </header>

            {/* Auth form area */}
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                {children}
            </div>

            <footer className="py-4 text-center">
                <p className="text-white/20 text-xs">
                    © {new Date().getFullYear()} Schedula. All rights reserved.
                </p>
            </footer>
        </div>
    );
}
