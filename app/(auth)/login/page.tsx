"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "same-origin",
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error ?? "Login failed");
                return;
            }

            // Full page reload so the browser sends the new cookie to the middleware
            localStorage.setItem("schedula_token", data.token);
            localStorage.setItem("schedula_user", JSON.stringify(data.user));
            window.location.href = "/dashboard";
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full max-w-sm">
            {/* Card */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
                    <p className="text-white/45 text-sm">Sign in to your Schedula account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Error */}
                    {error && (
                        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-sm text-white/60 font-medium" htmlFor="login-email">
                            Email address
                        </label>
                        <input
                            id="login-email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-white/25 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label className="text-sm text-white/60 font-medium" htmlFor="login-password">
                                Password
                            </label>
                            <Link
                                href="/forgot-password"
                                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <input
                            id="login-password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-white/25 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 mt-2"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Signing in…
                            </span>
                        ) : (
                            "Sign in"
                        )}
                    </button>
                </form>
            </div>

            {/* Footer link */}
            <p className="text-center text-sm text-white/35 mt-6">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                    Sign up for free
                </Link>
            </p>
        </div>
    );
}
