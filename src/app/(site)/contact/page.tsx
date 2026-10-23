"use client";

import React, { useState } from "react";
import { Copy, Check, Mail, MapPin, Send } from "lucide-react";

export default function Contact() {
    const [copied, setCopied] = useState(false);
    const email = "your-email@example.com"; // Replace with your actual email

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section id="contact" className="py-24 px-6 md:px-12 bg-white font-sans">
            <div className="max-w-6xl mx-auto">

                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-zinc-200/80">
                    <div>
                        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900">
                            Let&apos;s build something <br className="hidden sm:inline" />
                            <span className="text-[#F44A00]">exceptional</span> together.
                        </h2>
                    </div>

                    <p className="max-w-md text-sm sm:text-base text-zinc-600 leading-relaxed">
                        Have a product concept, a design system to scale, or an open product design role? Let&apos;s connect and create intuitive experiences.
                    </p>
                </div>

                {/* Contact Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Quick Info & Direct Mail Card (5 Columns) */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="p-8 rounded-3xl bg-zinc-900 text-white space-y-6 relative overflow-hidden shadow-xl">
                            {/* Subtle Ambient Orange Glow */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-600 blur-3xl pointer-events-none" />

                            <div className="space-y-2">
                                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                                    Direct Email
                                </span>
                                <p className="text-xl sm:text-2xl font-bold tracking-tight text-white break-all">
                                    {email}
                                </p>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    onClick={handleCopyEmail}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-100 transition-all cursor-pointer border border-zinc-700/80 active:scale-95"
                                >
                                    {copied ? (
                                        <>
                                            <Check size={14} className="text-emerald-400" />
                                            <span>Copied to Clipboard</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={14} />
                                            <span>Copy Address</span>
                                        </>
                                    )}
                                </button>

                                <a
                                    href={`mailto:${email}`}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#F44A00] hover:bg-orange-600 text-xs font-semibold text-white transition-all cursor-pointer shadow-sm active:scale-95"
                                >
                                    <Mail size={14} />
                                    <span>Send Email</span>
                                </a>
                            </div>

                            <div className="pt-6 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                                <div className="flex items-center gap-1.5">
                                    <MapPin size={14} className="text-[#F44A00]" />
                                    <span>Lagos, Nigeria (WAT / UTC+1)</span>
                                </div>
                            </div>
                        </div>

                        {/* Product Design Specializations Box */}
                        <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                                Product Design Scope
                            </h4>
                            <p className="text-xs text-zinc-600 leading-relaxed">
                                User Research & Strategy, UI/UX Design, Interactive Prototyping, Design Systems, Mobile & Web Products.
                            </p>
                        </div>
                    </div>

                    {/* Quick Message Form (7 Columns) */}
                    <div className="lg:col-span-7 p-8 rounded-3xl bg-zinc-50 border border-zinc-200/80 shadow-2xs">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                            }}
                            className="space-y-5"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label htmlFor="name" className="text-xs font-semibold text-zinc-700">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        required
                                        placeholder="Sarah Jenkins"
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-zinc-200 text-sm text-zinc-900 focus:outline-none focus:border-[#F44A00] focus:ring-1 focus:ring-[#F44A00] transition-colors"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="email" className="text-xs font-semibold text-zinc-700">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        placeholder="sarah@company.com"
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-zinc-200 text-sm text-zinc-900 focus:outline-none focus:border-[#F44A00] focus:ring-1 focus:ring-[#F44A00] transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="subject" className="text-xs font-semibold text-zinc-700">
                                    Subject / Scope
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    placeholder="Design System Audit / Senior Product Designer Role"
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-zinc-200 text-sm text-zinc-900 focus:outline-none focus:border-[#F44A00] focus:ring-1 focus:ring-[#F44A00] transition-colors"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="message" className="text-xs font-semibold text-zinc-700">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    required
                                    rows={4}
                                    placeholder="Tell me about your product vision, design challenges, or timeline..."
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-zinc-200 text-sm text-zinc-900 focus:outline-none focus:border-[#F44A00] focus:ring-1 focus:ring-[#F44A00] transition-colors resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-zinc-900 hover:bg-[#F44A00] text-white text-xs font-bold transition-all duration-300 shadow-sm cursor-pointer group"
                            >
                                <span>Send Message</span>
                                <Send size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </button>
                        </form>
                    </div>

                </div>

            </div>
        </section>
    );
}