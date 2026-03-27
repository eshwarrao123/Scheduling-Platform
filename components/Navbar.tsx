"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem("schedula_token"));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("schedula_token");
        localStorage.removeItem("schedula_user");
        window.location.href = "/login";
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <svg
                            className="w-4 h-4 text-white"
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
                    <span className="text-white font-semibold text-lg tracking-tight">
                        Schedula
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <Link
                        href="#features"
                        className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                        Features
                    </Link>
                    <Link
                        href="#how-it-works"
                        className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                        How it works
                    </Link>
                    <Link
                        href="#pricing"
                        className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                        Pricing
                    </Link>
                </div>

                {/* CTA */}
                <div className="hidden md:flex items-center gap-3">
                    {isLoggedIn ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="text-sm px-4 py-2 rounded bg-white/10 hover:bg-white/20 text-white transition-all shadow-sm"
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-sm text-white/50 hover:text-white transition-colors px-2"
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-sm text-white/70 hover:text-white transition-colors"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/signup"
                                className="text-sm px-4 py-2 rounded bg-white text-black font-medium hover:bg-white/90 transition-all shadow-sm"
                            >
                                Get started free
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden text-white/70 hover:text-white"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {menuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="md:hidden px-6 pb-4 bg-[#0a0a0f] border-t border-white/5 flex flex-col gap-4">
                    <Link href="#features" className="text-white/70 hover:text-white text-sm pt-4">Features</Link>
                    <Link href="#how-it-works" className="text-white/70 hover:text-white text-sm">How it works</Link>
                    <Link href="#pricing" className="text-white/70 hover:text-white text-sm">Pricing</Link>
                    {isLoggedIn ? (
                        <>
                            <Link href="/dashboard" className="text-sm px-4 py-2 rounded bg-white/10 text-white text-center">Dashboard</Link>
                            <button onClick={handleLogout} className="text-sm text-white/50 hover:text-white text-left">Log out</button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-white/70 hover:text-white text-sm">Log in</Link>
                            <Link href="/signup" className="text-sm px-4 py-2 rounded bg-white text-black font-medium text-center">Get started free</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
