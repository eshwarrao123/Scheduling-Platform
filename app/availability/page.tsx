"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";



type DayOfWeek =
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";

interface AvailabilitySlot {
    _id: string;
    day: DayOfWeek;
    startTime: string;
    endTime: string;
    isActive: boolean;
}



const DAYS: { key: DayOfWeek; label: string; short: string }[] = [
    { key: "monday", label: "Monday", short: "Mon" },
    { key: "tuesday", label: "Tuesday", short: "Tue" },
    { key: "wednesday", label: "Wednesday", short: "Wed" },
    { key: "thursday", label: "Thursday", short: "Thu" },
    { key: "friday", label: "Friday", short: "Fri" },
    { key: "saturday", label: "Saturday", short: "Sat" },
    { key: "sunday", label: "Sunday", short: "Sun" },
];

const TIME_OPTIONS: string[] = [];
for (let h = 0; h < 24; h++) {
    for (const m of ["00", "30"]) {
        TIME_OPTIONS.push(`${String(h).padStart(2, "0")}:${m}`);
    }
}

function format12h(time: string): string {
    const [hStr, mStr] = time.split(":");
    const h = parseInt(hStr);
    const suffix = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${mStr} ${suffix}`;
}



export default function AvailabilityPage() {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Map Days of Week to start/end times and toggle state
    const [dayConfig, setDayConfig] = useState<
        Record<DayOfWeek, { startTime: string; endTime: string; enabled: boolean }>
    >(() =>
        Object.fromEntries(
            DAYS.map((d) => [d.key, { startTime: "09:00", endTime: "17:00", enabled: false }])
        ) as Record<DayOfWeek, { startTime: string; endTime: string; enabled: boolean }>
    );

    const [saving, setSaving] = useState<DayOfWeek | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [globalError, setGlobalError] = useState("");
    const [successDay, setSuccessDay] = useState<DayOfWeek | null>(null);

    // Load user's saved availability into local form state
    const fetchSlots = useCallback(async (authToken: string) => {
        try {
            const res = await fetch("/api/availability", {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            const data = await res.json();
            if (data.success) {
                setSlots(data.data);
                // Merge existing slots into dayConfig
                setDayConfig((prev) => {
                    const next = { ...prev };
                    for (const slot of data.data as AvailabilitySlot[]) {
                        next[slot.day] = {
                            startTime: slot.startTime,
                            endTime: slot.endTime,
                            enabled: slot.isActive,
                        };
                    }
                    return next;
                });
            }
        } catch {
            setGlobalError("Failed to load availability.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const stored = localStorage.getItem("schedula_token");
        if (!stored) { router.push("/login"); return; }
        setToken(stored);
        fetchSlots(stored);
    }, [router, fetchSlots]);

    // Save a specific day's configuration
    async function saveDay(day: DayOfWeek) {
        if (!token) return;
        const { startTime, endTime, enabled } = dayConfig[day];

        if (startTime >= endTime) {
            setGlobalError(`End time must be after start time for ${day}.`);
            return;
        }
        setGlobalError("");
        setSaving(day);

        try {
            const res = await fetch("/api/availability", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ day, startTime, endTime, isActive: enabled }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error ?? "Failed to save");

            // Update slots list
            setSlots((prev) => {
                const exists = prev.find((s) => s.day === day);
                if (exists) return prev.map((s) => (s.day === day ? data.data : s));
                return [...prev, data.data];
            });

            setSuccessDay(day);
            setTimeout(() => setSuccessDay(null), 2000);
        } catch (err: unknown) {
            setGlobalError(err instanceof Error ? err.message : "Save failed");
        } finally {
            setSaving(null);
        }
    }

    // Remove a specific day's configuration
    async function deleteDay(day: DayOfWeek) {
        if (!token) return;
        const slot = slots.find((s) => s.day === day);
        if (!slot) return;

        setDeleting(slot._id);
        try {
            const res = await fetch(`/api/availability/${slot._id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Delete failed");

            setSlots((prev) => prev.filter((s) => s._id !== slot._id));
            setDayConfig((prev) => ({
                ...prev,
                [day]: { startTime: "09:00", endTime: "17:00", enabled: false },
            }));
        } catch (err: unknown) {
            setGlobalError(err instanceof Error ? err.message : "Delete failed");
        } finally {
            setDeleting(null);
        }
    }


    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            {/* Top bar */}
            <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md">
                <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="text-white/40 hover:text-white transition-colors"
                            aria-label="Back"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="text-white font-semibold text-sm">Availability</h1>
                    </div>
                    <span className="text-white/30 text-xs hidden sm:block">
                        Set your weekly working hours
                    </span>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 py-10">
                {/* Page header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">Weekly schedule</h2>
                        <p className="text-white/40 text-sm">
                            Define when you&apos;re available for meetings. Guests will only see these times.
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

                {/* Global error */}
                {globalError && (
                    <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {globalError}
                    </div>
                )}

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-3">
                        {DAYS.map(({ key, label }) => {
                            const cfg = dayConfig[key];
                            const savedSlot = slots.find((s) => s.day === key);
                            const isSaving = saving === key;
                            const isDeleting = deleting === savedSlot?._id;
                            const isSuccess = successDay === key;

                            return (
                                <div
                                    key={key}
                                    className={`rounded-2xl border transition-all duration-200 ${cfg.enabled
                                        ? "border-indigo-500/25 bg-indigo-500/5"
                                        : "border-white/[0.06] bg-white/[0.02]"
                                        }`}
                                >
                                    <div className="p-5">
                                        <div className="flex items-center gap-4 flex-wrap">
                                            {/* Toggle */}
                                            <button
                                                onClick={() =>
                                                    setDayConfig((prev) => ({
                                                        ...prev,
                                                        [key]: { ...prev[key], enabled: !prev[key].enabled },
                                                    }))
                                                }
                                                className={`relative w-10 h-5.5 rounded-full transition-all duration-200 shrink-0 focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                          ${cfg.enabled ? "bg-indigo-600" : "bg-white/10"}`}
                                                aria-label={`Toggle ${label}`}
                                                role="switch"
                                                aria-checked={cfg.enabled}
                                                style={{ height: "22px" }}
                                            >
                                                <span
                                                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${cfg.enabled ? "translate-x-[18px]" : "translate-x-0"
                                                        }`}
                                                />
                                            </button>

                                            {/* Day label */}
                                            <span
                                                className={`w-24 text-sm font-medium shrink-0 ${cfg.enabled ? "text-white" : "text-white/40"
                                                    }`}
                                            >
                                                {label}
                                            </span>

                                            {cfg.enabled ? (
                                                <>
                                                    {/* Start time */}
                                                    <div className="flex items-center gap-2">
                                                        <select
                                                            value={cfg.startTime}
                                                            onChange={(e) =>
                                                                setDayConfig((prev) => ({
                                                                    ...prev,
                                                                    [key]: { ...prev[key], startTime: e.target.value },
                                                                }))
                                                            }
                                                            className="px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                                        >
                                                            {TIME_OPTIONS.map((t) => (
                                                                <option key={t} value={t} className="bg-[#1a1a2e] text-white">
                                                                    {format12h(t)}
                                                                </option>
                                                            ))}
                                                        </select>

                                                        <span className="text-white/30 text-sm">→</span>

                                                        {/* End time */}
                                                        <select
                                                            value={cfg.endTime}
                                                            onChange={(e) =>
                                                                setDayConfig((prev) => ({
                                                                    ...prev,
                                                                    [key]: { ...prev[key], endTime: e.target.value },
                                                                }))
                                                            }
                                                            className="px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                                        >
                                                            {TIME_OPTIONS.map((t) => (
                                                                <option key={t} value={t} className="bg-[#1a1a2e] text-white">
                                                                    {format12h(t)}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-2 ml-auto">
                                                        {/* Save */}
                                                        <button
                                                            onClick={() => saveDay(key)}
                                                            disabled={isSaving}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-medium transition-all"
                                                        >
                                                            {isSaving ? (
                                                                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                                </svg>
                                                            ) : isSuccess ? (
                                                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            ) : (
                                                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            )}
                                                            {isSuccess ? "Saved!" : isSaving ? "Saving…" : "Save"}
                                                        </button>

                                                        {/* Delete (only if already saved) */}
                                                        {savedSlot && (
                                                            <button
                                                                onClick={() => deleteDay(key)}
                                                                disabled={isDeleting}
                                                                className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-50 transition-all"
                                                                aria-label={`Remove ${label}`}
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                </>
                                            ) : (
                                                <span className="text-white/25 text-sm ml-auto">Unavailable</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Summary card */}
                {slots.filter((s) => s.isActive).length > 0 && (
                    <div className="mt-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                        <h3 className="text-white/70 text-sm font-medium mb-3">Your current availability</h3>
                        <div className="flex flex-wrap gap-2">
                            {DAYS.filter(({ key }) => slots.find((s) => s.day === key && s.isActive)).map(({ key, short }) => {
                                const slot = slots.find((s) => s.day === key)!;
                                return (
                                    <div
                                        key={key}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300"
                                    >
                                        <span className="font-medium">{short}</span>
                                        <span className="text-indigo-400/60">{format12h(slot.startTime)} – {format12h(slot.endTime)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
