"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { DownloadCVButton } from "./DownloadCvButton";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on resize to desktop screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Canvas Starfield Background Effect (Matching Footer)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || 80;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const starCount = 60;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.1 + 0.3,
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
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.shadowBlur = star.radius > 1 ? 4 : 0;
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

  const navLinks = [
    { label: "Home", href: "/about" },
    { label: "Selected Work", href: "/work" },
    { label: "Contact", href: "/#contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#0B0301]/85 backdrop-blur-md overflow-hidden ${scrolled || mobileOpen
          ? "border-b border-[#F44A00]/20 py-3.5 shadow-xl"
          : "border-b border-transparent py-5"
          }`}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-12 bg-[#F44A00]/15 blur-2xl pointer-events-none" />

        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none z-0"
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 flex items-center justify-between">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="group flex items-center gap-2.5 font-heading text-base font-bold tracking-tight text-white hover:text-[#F44A00] transition-colors"
          >
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#F44A00] shadow-[0_0_8px_#F44A00] transition-transform group-hover:scale-125" />
            <span>Chidera Benjamin</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-zinc-300 hover:text-[#F44A00] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <DownloadCVButton />
          </div>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden relative z-50 flex flex-col justify-center items-center w-9 h-9 rounded-xl bg-[#160602] border border-[#F44A00]/30 text-white hover:bg-[#F44A00] transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            <span
              className={`block h-0.5 w-4 bg-white transition-all duration-300 ease-in-out ${mobileOpen ? "rotate-45 translate-y-0.75" : "-translate-y-1"
                }`}
            />
            <span
              className={`block h-0.5 w-4 bg-white transition-all duration-300 ease-in-out ${mobileOpen ? "opacity-0" : "opacity-100"
                }`}
            />
            <span
              className={`block h-0.5 w-4 bg-white transition-all duration-300 ease-in-out ${mobileOpen ? "-rotate-45 -translate-y-0.75" : "translate-y-1"
                }`}
            />
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 md:hidden overflow-hidden bg-[#0B0301]/95 backdrop-blur-xl border-b border-[#F44A00]/20 px-6 pt-4 pb-6 shadow-2xl"
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-base font-bold text-zinc-100 hover:text-[#F44A00] transition-colors py-1.5 border-b border-zinc-800/80"
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="pt-2 flex flex-col gap-3">
                  <div className="w-full">
                    <DownloadCVButton />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;