"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

export default function SignupPage() {

    const [form, setForm] = useState({
        name: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (form.password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "same-origin",
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    username: form.username,
                    password: form.password,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error ?? "Signup failed");
                return;
            }

            // Full page reload so browser sends new cookie to Next.js middleware
            localStorage.setItem("schedula_token", data.token);
            localStorage.setItem("schedula_user", JSON.stringify(data.user));
            window.location.href = "/dashboard";
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    const inputClass =
        "w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-white/25 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all";

    const fields: {
        id: string;
        name: keyof typeof form;
        label: string;
        type: string;
        placeholder: string;
        autoComplete: string;
    }[] = [
            { id: "signup-name", name: "name", label: "Full name", type: "text", placeholder: "Jane Doe", autoComplete: "name" },
            { id: "signup-email", name: "email", label: "Email address", type: "email", placeholder: "you@example.com", autoComplete: "email" },
            { id: "signup-username", name: "username", label: "Username", type: "text", placeholder: "janedoe", autoComplete: "username" },
            { id: "signup-password", name: "password", label: "Password", type: "password", placeholder: "Min. 8 characters", autoComplete: "new-password" },
            { id: "signup-confirm", name: "confirmPassword", label: "Confirm password", type: "password", placeholder: "••••••••", autoComplete: "new-password" },
        ];

    return (
        <div className="w-full max-w-sm">
            {/* Card */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
                    <p className="text-white/45 text-sm">Start scheduling smarter today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Error */}
                    {error && (
                        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {fields.map((field) => (
                        <div key={field.id} className="space-y-1.5">
                            <label className="text-sm text-white/60 font-medium" htmlFor={field.id}>
                                {field.label}
                            </label>
                            <input
                                id={field.id}
                                name={field.name}
                                type={field.type}
                                autoComplete={field.autoComplete}
                                required
                                value={form[field.name]}
                                onChange={handleChange}
                                placeholder={field.placeholder}
                                className={inputClass}
                            />
                        </div>
                    ))}

                    {/* Password strength hint */}
                    {form.password.length > 0 && form.password.length < 8 && (
                        <p className="text-xs text-amber-400/80">
                            Password needs {8 - form.password.length} more character{8 - form.password.length !== 1 ? "s" : ""}
                        </p>
                    )}

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
                                Creating account…
                            </span>
                        ) : (
                            "Create account →"
                        )}
                    </button>

                    <p className="text-xs text-white/25 text-center pt-1">
                        By signing up, you agree to our{" "}
                        <Link href="/terms" className="underline hover:text-white/50 transition-colors">Terms</Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="underline hover:text-white/50 transition-colors">Privacy Policy</Link>
                    </p>
                </form>
            </div>

            {/* Footer link */}
            <p className="text-center text-sm text-white/35 mt-6">
                Already have an account?{" "}
                <Link href="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                    Sign in
                </Link>
            </p>
        </div>
    );
}
