"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";

export default function Footer() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // Canvas Starfield Effect
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;

        const resizeCanvas = () => {
            canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
            canvas.height = canvas.parentElement?.clientHeight || 260;
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        // Generate random star data
        const starCount = 130;
        const stars = Array.from({ length: starCount }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.3 + 0.3,
            alpha: Math.random(),
            speed: Math.random() * 0.012 + 0.003,
            growing: Math.random() > 0.5,
        }));

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            stars.forEach((star) => {
                if (star.growing) {
                    star.alpha += star.speed;
                    if (star.alpha >= 1) star.growing = false;
                } else {
                    star.alpha -= star.speed;
                    if (star.alpha <= 0.1) star.growing = true;
                }

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);

                // Crisp glowing stars against the brand background
                ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
                ctx.shadowBlur = star.radius > 1 ? 5 : 0;
                ctx.shadowColor = "#F44A00";

                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <footer className="relative w-full bg-[#0B0301] py-20 px-6 overflow-hidden border-t border-[#F44A00]/20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-62.5 bg-orange-600/60 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-72 h-32 bg-orange-600/60 blur-[80px] pointer-events-none" />
            <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none z-0"
            />

            <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center justify-center space-y-4">
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <a
                        href="mailto:your-email@example.com"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#160602]/90 border border-[#F44A00]/30 text-xs font-semibold text-zinc-100 hover:bg-[#F44A00] hover:border-[#F44A00] transition-all duration-300 shadow-md backdrop-blur-xs group"
                    >
                        <Mail size={15} className="group-hover:scale-110 transition-transform" />
                        <span>My mail</span>
                    </a>

                    <a
                        href="https://dribbble.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#160602]/90 border border-[#F44A00]/30 text-xs font-semibold text-zinc-100 hover:bg-[#F44A00] hover:border-[#F44A00] transition-all duration-300 shadow-md backdrop-blur-xs group"
                    >
                        <DribbbleIcon className="w-3.5 h-3.5 fill-current group-hover:scale-110 transition-transform" />
                        <span>Dribbble</span>
                    </a>

                    <a
                        href="https://behance.net"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#160602]/90 border border-[#F44A00]/30 text-xs font-semibold text-zinc-100 hover:bg-[#F44A00] hover:border-[#F44A00] transition-all duration-300 shadow-md backdrop-blur-xs group"
                    >
                        <BehanceIcon className="w-3.5 h-3.5 fill-current group-hover:scale-110 transition-transform" />
                        <span>Behance</span>
                    </a>
                </div>

                <div className="flex items-center justify-center gap-3 pt-1">
                    <a
                        href="#"
                        className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#160602]/90 border border-[#F44A00]/30 text-zinc-100 hover:bg-[#F44A00] hover:border-[#F44A00] transition-all duration-300 shadow-md backdrop-blur-xs group"
                        title="Read.cv"
                    >
                        <AsteriskIcon className="w-4 h-4 fill-current group-hover:rotate-45 transition-transform" />
                    </a>

                    <a
                        href="https://x.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#160602]/90 border border-[#F44A00]/30 text-zinc-100 hover:bg-[#F44A00] hover:border-[#F44A00] transition-all duration-300 shadow-md backdrop-blur-xs group"
                        title="X (Twitter)"
                    >
                        <XIcon className="w-3.5 h-3.5 fill-current group-hover:scale-110 transition-transform" />
                    </a>

                    <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#160602]/90 border border-[#F44A00]/30 text-zinc-100 hover:bg-[#F44A00] hover:border-[#F44A00] transition-all duration-300 shadow-md backdrop-blur-xs group"
                        title="LinkedIn"
                    >
                        <LinkedinIcon className="w-3.5 h-3.5 fill-current group-hover:scale-110 transition-transform" />
                    </a>
                </div>

            </div>
        </footer>
    );
}

function DribbbleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <circle cx="12" cy="12" r="10" />
            <path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94" />
            <path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32" />
            <path d="M8.56 2.75c4.37 6 6 9.42 8 18.5" />
        </svg>
    );
}

function BehanceIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" {...props}>
            <path d="M22 7h-7V5h7v2zm-1.708 3.791c-1.556 0-2.825 1.157-2.923 2.709h5.71c-.13-1.579-1.341-2.709-2.787-2.709zm-2.915 5.089c.191 1.258 1.254 2.12 2.628 2.12 1.054 0 1.902-.452 2.378-1.282h2.522c-.655 2.18-2.617 3.282-4.9 3.282-3.13 0-5.513-2.197-5.513-5.5 0-3.181 2.372-5.5 5.378-5.5 3.208 0 5.415 2.298 5.415 5.5v1.38h-7.908zm-9.043-4.88c0 1.082-.878 1.636-2.072 1.636H3.5V9.364h2.762c1.194 0 2.072.554 2.072 1.636zm.303 5.385c0 1.194-.972 1.796-2.28 1.796H3.5v-3.592h2.884c1.308 0 2.28.602 2.28 1.796zM0 6v12h6.536c2.618 0 4.385-1.082 4.385-2.879 0-1.144-.652-2.083-1.745-2.522 1.002-.439 1.523-1.308 1.523-2.43 0-1.636-1.543-2.619-3.923-2.619H0z" />
        </svg>
    );
}

function AsteriskIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" {...props}>
            <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
    );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" {...props}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" {...props}>
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
    );
}