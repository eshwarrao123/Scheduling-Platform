"use client";

import Link from "next/link";
import { useState, useEffect, use } from "react";

interface Host {
    _id: string;
    name: string;
    username: string;
}

function generateNextDays(count: number): Date[] {
    const days: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < count; i++) {
        const nextDay = new Date(today);
        nextDay.setDate(today.getDate() + i);
        days.push(nextDay);
    }
    return days;
}

function formatDateISO(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function format12h(time: string): string {
    const [hStr, mStr] = time.split(":");
    const h = parseInt(hStr);
    const suffix = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${mStr} ${suffix}`;
}

function generateICS(hostName: string, guestName: string, date: Date, timeStr: string, duration: number = 30) {
    const [year, month, day] = [date.getFullYear(), date.getMonth(), date.getDate()];
    const [hour, minute] = timeStr.split(":").map(Number);

    const start = new Date(year, month, day, hour, minute);
    const end = new Date(start.getTime() + duration * 60000);

    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Schedula//EN",
        "BEGIN:VEVENT",
        `UID:${start.getTime()}@schedula.app`,
        `DTSTAMP:${fmt(new Date())}`,
        `DTSTART:${fmt(start)}`,
        `DTEND:${fmt(end)}`,
        `SUMMARY:Meeting with ${hostName}`,
        `DESCRIPTION:Scheduled meeting between ${hostName} and ${guestName}.`,
        "END:VEVENT",
        "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Meeting_with_${hostName.replace(/\s+/g, "_")}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export default function PublicBookingPage({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    const resolvedParams = use(params);
    const username = resolvedParams.username;

    const [host, setHost] = useState<Host | null>(null);
    const [loadError, setLoadError] = useState("");
    const [isLoadingHost, setIsLoadingHost] = useState(true);

    const availableDates = generateNextDays(14);
    const [selectedDate, setSelectedDate] = useState<Date>(availableDates[0]);
    const [slots, setSlots] = useState<{ time: string; available: boolean }[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [guestName, setGuestName] = useState("");
    const [guestEmail, setGuestEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingError, setBookingError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const [timeZone, setTimeZone] = useState("");

    useEffect(() => {
        setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }, []);

    // 1. Fetch host profile
    useEffect(() => {
        async function fetchHost() {
            try {
                const res = await fetch(`/api/users/${username}`);
                const data = await res.json();
                if (data.success) {
                    setHost(data.data);
                } else {
                    setLoadError(data.error || "Host not found");
                }
            } catch (err: any) {
                setLoadError(err.message || "Failed to load profile");
            } finally {
                setIsLoadingHost(false);
            }
        }
        fetchHost();
    }, [username]);

    // 2. Fetch available slots when selectedDate changes
    useEffect(() => {
        if (!host) return;

        async function fetchSlots() {
            setIsLoadingSlots(true);
            setSelectedSlot(null);
            setBookingError("");
            try {
                const dateStr = formatDateISO(selectedDate);
                const res = await fetch(`/api/users/${username}/slots?date=${dateStr}`);
                const data = await res.json();
                if (data.success) {
                    setSlots(data.data);
                } else {
                    setSlots([]);
                }
            } catch (err) {
                setSlots([]);
            } finally {
                setIsLoadingSlots(false);
            }
        }

        fetchSlots();
    }, [selectedDate, host, username]);

    // 3. Handle Booking Submission
    async function handleBook(e: React.FormEvent) {
        e.preventDefault();
        if (!host || !selectedSlot) return;

        setIsSubmitting(true);
        setBookingError("");

        try {
            const res = await fetch("/api/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: host._id,
                    guestName: guestName,
                    guestEmail: guestEmail,
                    selectedDate: formatDateISO(selectedDate),
                    selectedTime: selectedSlot,
                    timezone: timeZone,
                    calendarSynced: true,
                }),
            });

            const data = await res.json();

            if (data.success) {
                setIsSuccess(true);
            } else {
                setBookingError(data.error || "Failed to complete booking");
                // Re-fetch slots in case the slot was snatched by someone else
                const reloadRes = await fetch(
                    `/api/users/${username}/slots?date=${formatDateISO(selectedDate)}`
                );
                const reloadData = await reloadRes.json();
                if (reloadData.success) setSlots(reloadData.data);
                setSelectedSlot(null);
            }
        } catch (err: any) {
            setBookingError(err.message || "Network error. Try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    // ─── Render States ────────────────────────────────────────────────────────
    if (isLoadingHost) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (loadError || !host) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 text-white/30">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Host Not Found</h1>
                <p className="text-white/40 mb-6">The booking link you followed is invalid or has expired.</p>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 text-indigo-400">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-white mb-3">Booking Confirmed!</h1>
                <p className="text-white/60 mb-2">
                    You are scheduled with <span className="text-white font-medium">{host.name}</span>
                </p>
                <div className="px-5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] inline-block mb-6">
                    <p className="text-indigo-300 font-medium">
                        {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} at {format12h(selectedSlot!)}
                    </p>
                </div>

                <button
                    onClick={() => generateICS(host.name, guestName, selectedDate, selectedSlot!)}
                    className="flex items-center gap-2 text-white bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-xl mb-8 mx-auto w-fit text-sm font-medium transition-colors shadow-sm"
                >
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Add to Calendar (.ics)
                </button>
                <button
                    onClick={() => {
                        setIsSuccess(false);
                        setSelectedSlot(null);
                        setGuestName("");
                        setGuestEmail("");
                    }}
                    className="text-sm font-medium text-white/50 hover:text-white transition-colors"
                >
                    Book another meeting
                </button>
            </div>
        );
    }

    // ─── Main Interface ────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#0a0a0f] py-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl overflow-hidden flex flex-col md:flex-row min-h-[600px] shadow-2xl">

                {/* Left Column: Host Info */}
                <div className="md:w-1/3 bg-black/40 p-8 border-b md:border-b-0 md:border-r border-white/[0.08] flex flex-col">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mb-6 flex items-center justify-center border-4 border-[#0a0a0f] shadow-lg">
                        <span className="text-white text-xl font-bold">
                            {host.name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <h2 className="text-white/50 font-medium text-sm mb-1 uppercase tracking-wider">Meet with</h2>
                    <h1 className="text-2xl font-bold text-white mb-2">{host.name}</h1>
                    <p className="text-indigo-400 font-medium text-sm mb-6">@{host.username}</p>

                    <div className="flex items-center gap-3 text-white/40 text-sm mb-3">
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>30 Minute Meeting</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/40 text-sm mb-8">
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>Web conferencing details provided upon confirmation.</span>
                    </div>

                    <div className="mt-auto pt-8">
                        <p className="text-xs text-white/20">Powered by Schedula</p>
                    </div>
                </div>

                {/* Right Column: Date/Time Picker or Form */}
                <div className="md:w-2/3 p-8">
                    {!selectedSlot ? (
                        <>
                            <div className="mb-8 flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-white">Select a Date & Time</h3>
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

                            {/* Date Scroll */}
                            <div className="flex gap-3 overflow-x-auto pb-4 mb-6 custom-scrollbar">
                                {availableDates.map((date) => {
                                    const isSelected = formatDateISO(date) === formatDateISO(selectedDate);
                                    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
                                    const dayNum = date.getDate();
                                    const monthName = date.toLocaleDateString("en-US", { month: "short" });

                                    return (
                                        <button
                                            key={date.toISOString()}
                                            onClick={() => setSelectedDate(date)}
                                            className={`flex flex-col items-center min-w-[72px] p-3 rounded-2xl border transition-all duration-200 ${isSelected
                                                ? "border-indigo-500 bg-indigo-500/10"
                                                : "border-white/[0.08] hover:border-white/20 bg-white/[0.02]"
                                                }`}
                                        >
                                            <span className={`text-xs mb-1 ${isSelected ? "text-indigo-400" : "text-white/40"}`}>{monthName}</span>
                                            <span className={`text-xl font-bold mb-1 ${isSelected ? "text-white" : "text-white/80"}`}>{dayNum}</span>
                                            <span className={`text-xs font-medium uppercase ${isSelected ? "text-indigo-400" : "text-white/40"}`}>{dayName}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Time Slots */}
                            <div>
                                <h4 className="text-white/70 font-medium mb-1">
                                    Available times for {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                                </h4>
                                <p className="text-xs text-white/40 mb-4">
                                    All times are shown in your local timezone ({timeZone})
                                </p>

                                {isLoadingSlots ? (
                                    <div className="flex items-center justify-center py-10">
                                        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                    </div>
                                ) : slots.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {slots.map((slot) => (
                                            <button
                                                key={slot.time}
                                                onClick={() => slot.available && setSelectedSlot(slot.time)}
                                                disabled={!slot.available}
                                                className={`py-3 px-4 rounded-xl border font-medium transition-all text-sm ${slot.available
                                                    ? "border-white/[0.08] bg-white/[0.03] text-indigo-300 hover:bg-white/[0.08] hover:border-white/[0.15] hover:text-white"
                                                    : "border-white/[0.02] bg-white/[0.01] text-white/20 cursor-not-allowed line-through"
                                                    }`}
                                            >
                                                {format12h(slot.time)}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-6 rounded-2xl border border-white/[0.04] bg-white/[0.01] text-center">
                                        <p className="text-white/40 text-sm">No available times for this date.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-semibold text-white">Guest Details</h3>
                                <button
                                    onClick={() => setSelectedSlot(null)}
                                    className="text-sm text-white/40 hover:text-white flex items-center gap-1 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Back
                                </button>
                            </div>

                            <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 mb-8 flex items-start gap-4">
                                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 mt-0.5">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-white font-medium">Selected time column</p>
                                    <p className="text-indigo-300/80 text-sm mt-1">
                                        {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}<br />
                                        {format12h(selectedSlot)} – {format12h(
                                            (() => {
                                                const [h, m] = selectedSlot.split(":").map(Number);
                                                const endM = m + 30;
                                                return `${String(h + Math.floor(endM / 60)).padStart(2, '0')}:${String(endM % 60).padStart(2, '0')}`;
                                            })()
                                        )}
                                    </p>
                                </div>
                            </div>

                            {bookingError && (
                                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                    {bookingError}
                                </div>
                            )}

                            <form onSubmit={handleBook} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">Full Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={guestName}
                                        onChange={(e) => setGuestName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                        placeholder="Jane Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">Email Address *</label>
                                    <input
                                        type="email"
                                        required
                                        value={guestEmail}
                                        onChange={(e) => setGuestEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                        placeholder="jane@example.com"
                                    />
                                </div>
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            "Confirm Booking"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
