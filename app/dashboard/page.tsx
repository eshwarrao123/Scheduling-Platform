"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AuthUser {
    id: string;
    email: string;
    username: string;
    timezone?: string;
}

function format12h(time: string): string {
    if (!time) return "";
    const [hStr, mStr] = time.split(":");
    const h = parseInt(hStr);
    const suffix = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${mStr} ${suffix}`;
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<AuthUser | null>(null);
    const [events, setEvents] = useState<any[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("schedula_user");
        if (!stored) {
            router.push("/login");
            return;
        }
        const parsedUser = JSON.parse(stored);
        setUser(parsedUser);

        fetch("/api/events")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    const myEvents = data.data.filter(
                        (e: any) =>
                            (e.userId?._id || e.userId) === parsedUser.id
                    );
                    setEvents(myEvents);
                }
            })
            .catch(console.error);

        fetch(`/api/book?userId=${parsedUser.id}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) setBookings(data.data);
            })
            .catch(console.error);
    }, [router]);

    function handleLogout() {
        localStorage.removeItem("schedula_token");
        localStorage.removeItem("schedula_user");
        window.location.href = "/login";
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            {/* Sticky top bar */}
            <header className="border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded flex items-center justify-center bg-white/10 text-white">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <span className="text-white font-medium text-sm tracking-tight">Schedula</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-white/40 text-sm hidden sm:block">@{user.username}</span>
                        <button
                            onClick={handleLogout}
                            className="text-sm text-white/50 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
                        >
                            Log out
                        </button>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="max-w-5xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">
                            Overview
                        </h1>
                        <p className="text-white/40 text-sm">
                            Manage your scheduling links and upcoming meetings.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/create-event"
                            className="text-sm bg-white text-black font-medium px-4 py-2 rounded shadow-sm hover:bg-white/90 transition-colors"
                        >
                            Create Event
                        </Link>
                    </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                    {[
                        { label: "Active Events", value: events.length.toString(), subtext: "Live links" },
                        { label: "Bookings", value: bookings.length.toString(), subtext: "Total upcoming" },
                        { label: "Profile Views", value: "84", subtext: "This month" },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-lg border border-white/[0.08] bg-[#0c0c10] px-5 py-4 flex flex-col"
                        >
                            <span className="text-white/40 text-[11px] font-medium uppercase tracking-wider mb-2">{stat.label}</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-semibold text-white">{stat.value}</span>
                                <span className="text-white/30 text-xs">{stat.subtext}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Two columns layout */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                    {/* Main area - Event Types & Bookings */}
                    <div className="xl:col-span-2 space-y-8">
                        {/* Bookings Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-white font-medium text-sm">Upcoming Meetings</h2>
                                <span className="text-xs text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded">Times shown in {user.timezone || "UTC"}</span>
                            </div>
                            <div className="rounded-lg border border-white/[0.08] bg-[#0c0c10] divide-y divide-white/5">
                                {bookings.length === 0 ? (
                                    <div className="p-8 text-center text-white/40 text-sm">No upcoming meetings.</div>
                                ) : (
                                    bookings.map((b) => (
                                        <div key={b._id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                                            <div className="flex items-start gap-4">
                                                <div className="w-9 h-9 rounded bg-[#15151a] border border-white/5 flex items-center justify-center text-white/50 text-xs font-medium">
                                                    {(b.guestName || b.name || "U").charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-white mb-0.5">{b.guestName || b.name || "Unknown Guest"}</p>
                                                    <p className="text-xs text-white/40">{b.guestEmail || b.email || ""}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-white/80 font-medium">
                                                    {new Date(b.selectedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                                </p>
                                                <p className="text-xs text-white/40">{format12h(b.selectedTime)}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Event Types Section */}
                        <div className="space-y-4">
                            <h2 className="text-white font-medium text-sm">Your Event Types</h2>
                        </div>
                        <div className="rounded-lg border border-white/[0.08] bg-[#0c0c10] divide-y divide-white/5">
                            {events.length === 0 ? (
                                <div className="p-8 text-center">
                                    <p className="text-white/40 text-sm">No events created yet.</p>
                                    <Link href="/create-event" className="text-indigo-400 text-sm mt-2 inline-block hover:underline">
                                        Create one now
                                    </Link>
                                </div>
                            ) : (
                                events.map((event) => (
                                    <div key={event._id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded bg-[#15151a] border border-white/5 flex items-center justify-center text-white/50 text-xs font-medium shrink-0">
                                                {event.duration}m
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white mb-0.5">{event.title}</p>
                                                <p className="text-xs text-white/40">
                                                    /{event.slug} <span className="mx-1.5">•</span> {event.duration} Min Meeting
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(`${window.location.origin}/book/${user.username}`);
                                                    alert("Link copied!");
                                                }}
                                                className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-medium transition-colors"
                                            >
                                                Copy Link
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Sidebar - Configuration */}
                    <div className="space-y-4">
                        <h2 className="text-white font-medium text-sm">Your Schedule</h2>
                        <div className="flex flex-col gap-3">
                            <Link
                                href="/availability"
                                className="p-4 rounded-lg border border-white/[0.08] bg-[#0c0c10] hover:border-white/[0.15] transition-all flex items-start gap-3"
                            >
                                <div className="w-7 h-7 mt-0.5 rounded bg-white/5 flex items-center justify-center text-white/40 shrink-0">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white mb-0.5">Set Availability</p>
                                    <p className="text-xs text-white/40 leading-relaxed">Update your weekly recurring hours and blocked days.</p>
                                </div>
                            </Link>

                            <Link
                                href={`/book/${user.username}`}
                                className="p-4 rounded-lg border border-white/[0.08] bg-[#0c0c10] hover:border-white/[0.15] transition-all flex items-start gap-3"
                            >
                                <div className="w-7 h-7 mt-0.5 rounded bg-white/5 flex items-center justify-center text-white/40 shrink-0">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white mb-0.5">Public Booking Page</p>
                                    <p className="text-xs text-white/40 leading-relaxed break-all">schedula.app/book/{user.username}</p>
                                </div>
                            </Link>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
