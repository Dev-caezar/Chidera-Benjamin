"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { DownloadCVButton } from "./DownloadCvButton";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "about" },
    { label: "Selected Work", href: "work" },
    { label: "Contact", href: "contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-white/80 backdrop-blur-md border-b border-zinc-200/60 py-3 shadow-xs"
        : "bg-white/50 backdrop-blur-sm py-5"
        }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">

        <Link
          href="/"
          className="group flex items-center gap-2.5 font-heading text-base font-bold tracking-tight text-zinc-900 hover:text-[#F44A00] transition-colors"
        >
          <span className="flex h-2.5 w-2.5 rounded-full bg-[#F44A00] transition-transform group-hover:scale-125" />
          <span>Chidera Benjamin</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-zinc-600 hover:text-[#F44A00] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <DownloadCVButton />

        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden relative z-50 flex flex-col justify-center items-center w-8 h-8 rounded-lg hover:bg-zinc-100 transition-colors"
          aria-label="Toggle menu"
        >
          <span
            className={`block h-0.5 w-5 bg-zinc-900 transition-transform duration-300 ${mobileOpen ? "rotate-45 translate-y-1" : "-translate-y-1"
              }`}
          />
          <span
            className={`block h-0.5 w-5 bg-zinc-900 transition-opacity duration-300 ${mobileOpen ? "opacity-0" : "opacity-100"
              }`}
          />
          <span
            className={`block h-0.5 w-5 bg-zinc-900 transition-transform duration-300 ${mobileOpen ? "-rotate-45 -translate-y-1" : "translate-y-1"
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
            className="md:hidden overflow-hidden bg-white/95 backdrop-blur-md border-b border-zinc-200/80 px-6 pt-4 pb-6 shadow-xl"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-bold text-zinc-900 hover:text-[#F44A00] transition-colors py-1"
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-2 border-t border-zinc-100">
                <Link
                  href="#contact"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between w-full bg-[#F44A00] text-white text-sm font-bold px-5 py-3 rounded-2xl hover:bg-orange-600 transition-colors"
                >
                  <span>Get in touch</span>
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;