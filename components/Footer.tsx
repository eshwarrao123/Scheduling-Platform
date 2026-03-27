"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
    const pathname = usePathname();

    if (pathname !== "/") {
        return null;
    }

    return (
        <footer className="border-t border-white/5 bg-[#0a0a0f] py-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="text-white font-semibold">Schedula</span>
                        </div>
                        <p className="text-white/40 text-sm leading-relaxed">
                            Smart scheduling for modern teams and individuals.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="text-white/80 text-sm font-medium mb-4">Product</h4>
                        <ul className="space-y-2">
                            {["Features", "Pricing", "Changelog"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-white/40 hover:text-white/80 text-sm transition-colors">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-white/80 text-sm font-medium mb-4">Company</h4>
                        <ul className="space-y-2">
                            {["About", "Blog", "Careers"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-white/40 hover:text-white/80 text-sm transition-colors">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-white/80 text-sm font-medium mb-4">Legal</h4>
                        <ul className="space-y-2">
                            {["Privacy", "Terms", "Security"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-white/40 hover:text-white/80 text-sm transition-colors">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-white/30 text-xs">© {new Date().getFullYear()} Schedula. All rights reserved.</p>
                    <p className="text-white/30 text-xs">Built with Next.js & MongoDB</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
