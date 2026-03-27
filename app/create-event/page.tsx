"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateEventPage() {
    const router = useRouter();
    const [user, setUser] = useState<{ id: string; username: string } | null>(null);

    const [title, setTitle] = useState("");
    const [duration, setDuration] = useState("30");
    const [description, setDescription] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const stored = localStorage.getItem("schedula_user");
        if (!stored) {
            router.push("/login");
            return;
        }
        setUser(JSON.parse(stored));
    }, [router]);

    async function handleGenerateDescription() {
        if (!title) {
            setError("Please enter an Event Name first to generate a description.");
            return;
        }

        setIsGenerating(true);
        setError("");

        try {
            const res = await fetch("/api/ai/generate-description", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title }),
            });
            const data = await res.json();
            if (data.success) {
                setDescription(data.description);
            } else {
                setError(data.error || "Failed to generate description");
            }
        } catch (err) {
            setError("Failed to connect to AI generator.");
        } finally {
            setIsGenerating(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!user) return;

        setIsSubmitting(true);
        setError("");

        try {
            // Generate a simple slug from the title
            const slug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "");

            const res = await fetch("/api/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    title,
                    slug,
                    duration: parseInt(duration),
                    description,
                }),
            });

            const data = await res.json();
            if (data.success) {
                alert("Event created successfully");
                window.location.href = "/dashboard";
            } else {
                setError(data.error || "Failed to create event");
            }
        } catch (err: any) {
            setError(err.message || "Network error. Try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!user) return <div className="min-h-screen bg-[#0a0a0f]" />;

    return (
        <div className="min-h-screen bg-[#0a0a0f] py-12 px-6">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <br /><br />
                        <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">
                            Create Event
                        </h1>
                        <p className="text-white/40 text-sm">
                            Add a new meeting type for guests to book.
                        </p>
                    </div>
                    <Link
                        href="/dashboard"
                        className="text-sm text-white/40 hover:text-white transition-colors flex items-center gap-1"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </Link>
                </div>

                <div className="bg-[#0c0c10] border border-white/[0.08] rounded-xl p-6 md:p-8">
                    {error && (
                        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">
                                Event Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-all"
                                placeholder="e.g. 30 Min Discovery Call"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">
                                Duration *
                            </label>
                            <div className="relative">
                                <select
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white appearance-none focus:outline-none focus:border-white/20 transition-all"
                                >
                                    <option value="15">15 minutes</option>
                                    <option value="30">30 minutes</option>
                                    <option value="45">45 minutes</option>
                                    <option value="60">60 minutes</option>
                                    <option value="90">90 minutes</option>
                                    <option value="120">120 minutes</option>
                                </select>
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-white/40">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-white/70">
                                    Description (Optional)
                                </label>
                                <button
                                    type="button"
                                    onClick={handleGenerateDescription}
                                    disabled={isGenerating || !title}
                                    className="text-xs flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 disabled:opacity-50 transition-colors bg-indigo-400/10 hover:bg-indigo-400/20 px-3 py-1 rounded-full font-medium"
                                >
                                    {isGenerating ? (
                                        <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin shrink-0" />
                                    ) : (
                                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    )}
                                    {isGenerating ? "Generating..." : "Generate with AI"}
                                </button>
                            </div>
                            <textarea
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-all resize-none"
                                placeholder="Instructions for your attendees..."
                            />
                        </div>

                        <div className="pt-4 flex justify-end gap-3 border-t border-white/5">
                            <Link
                                href="/dashboard"
                                className="px-5 py-2.5 rounded text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={isSubmitting || !title}
                                className="px-6 py-2.5 rounded bg-white text-black text-sm font-medium hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center min-w-[120px]"
                            >
                                {isSubmitting ? (
                                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                ) : (
                                    "Save Event"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
