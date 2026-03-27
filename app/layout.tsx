import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Schedula — Smart Scheduling for Modern Teams",
  description:
    "Schedula is a powerful scheduling platform that eliminates the back-and-forth. Share your availability, let others book time, and stay in control of your calendar.",
  keywords: ["scheduling", "calendar", "booking", "meetings", "calendly alternative"],
  openGraph: {
    title: "Schedula — Smart Scheduling",
    description: "Share your availability. Let others book. Stay in control.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0a0a0f] text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
