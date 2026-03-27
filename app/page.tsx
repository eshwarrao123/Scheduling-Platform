import Link from "next/link";
import FeatureCard from "@/components/FeatureCard";

const features = [
  {
    title: "Smart Scheduling",
    description:
      "Share a single link and let anyone book time based on your real-time availability. No back-and-forth emails.",
    highlight: true,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Multiple Event Types",
    description:
      "Create 15-min calls, 1-hour demos, or custom durations. Each event type gets its own shareable link.",
    highlight: false,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    title: "Team Scheduling",
    description:
      "Coordinate across your whole team. Round-robin or collective availability — your guests see it all unified.",
    highlight: false,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "Timezone Aware",
    description:
      "All bookings automatically adjust to your guest's timezone. No confusion, no missed meetings.",
    highlight: false,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Instant Confirmations",
    description:
      "Guests receive automatic booking confirmations and calendar invites the moment they schedule.",
    highlight: false,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Custom Branding",
    description:
      "Make your booking page feel like yours. Add your photo, bio, and brand colors to impress guests.",
    highlight: false,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
  },
];

const stats = [
  { value: "10k+", label: "Meetings scheduled" },
  { value: "99.9%", label: "Uptime guarantee" },
  { value: "150+", label: "Countries supported" },
  { value: "< 2s", label: "Average booking time" },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center px-6 pt-24 pb-20 border-b border-white/[0.04]">
        <div className="max-w-6xl mx-auto w-full flex flex-col items-start text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-white/60 text-xs font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
            Schedula is now in public beta
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-[5rem] font-semibold tracking-tight text-white mb-6 leading-[1.05] max-w-4xl">
            Scheduling that works for you.
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/40 max-w-2xl mb-10 leading-relaxed font-light">
            Share your availability in one link. Let clients, teammates, and collaborators book time instantly — no emails, no friction.
          </p>

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link
              href="/signup"
              className="w-full sm:w-auto text-center px-6 py-3 rounded bg-white text-black font-medium text-sm transition-colors shadow-sm hover:bg-white/90"
            >
              Get started for free
            </Link>
            <Link
              href="#features"
              className="w-full sm:w-auto text-center px-6 py-3 rounded border border-white/10 bg-transparent text-white/70 hover:bg-white/5 hover:text-white text-sm font-medium transition-colors"
            >
              See how it works
            </Link>
          </div>

          {/* Social proof */}
          <p className="mt-6 text-white/30 text-xs">
            No credit card required. Free plan available.
          </p>
        </div>
      </section>

      {/* Stats banner */}
      <section className="border-b border-white/[0.04] bg-[#0c0c10] py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col border-l border-white/10 pl-6">
              <span className="text-3xl font-semibold text-white tracking-tight mb-1">{stat.value}</span>
              <span className="text-white/40 text-sm">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 border-b border-white/[0.04]">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="mb-16 max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-medium text-white mb-4 tracking-tight">
              Everything you need to schedule smarter.
            </h2>
            <p className="text-white/40 text-base leading-relaxed">
              Built for professionals who value their time. Simple enough for individuals, powerful enough for teams.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                highlight={feature.highlight}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-indigo-400 text-sm font-medium uppercase tracking-widest mb-3">
            How it works
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-16">
            Three steps to zero scheduling chaos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create your page",
                description: "Sign up, set your availability hours, and define your event types.",
              },
              {
                step: "02",
                title: "Share your link",
                description: "Send your unique Schedula link via email, LinkedIn, or anywhere.",
              },
              {
                step: "03",
                title: "Get booked",
                description: "Guests pick a time that works for both of you. Done. No back-and-forth.",
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-indigo-500/30 bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-mono font-bold text-sm">
                  {item.step}
                </div>
                <h3 className="text-white font-semibold text-base">{item.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-xl border border-white/10 bg-[#0c0c10] p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl font-medium text-white mb-2">
                Ready to reclaim your time?
              </h2>
              <p className="text-white/40">
                Join thousands of professionals using Schedula.
              </p>
            </div>
            <Link
              href="/signup"
              className="whitespace-nowrap px-6 py-3 rounded bg-white text-black font-medium text-sm hover:bg-white/90 transition-colors shadow-sm"
            >
              Start scheduling for free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
