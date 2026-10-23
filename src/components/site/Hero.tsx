"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const words = ["Design", "Product", "Website", "Brand"];

const Hero = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full bg-white py-28 md:py-36 px-6 overflow-hidden">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-80 bg-linear-to-tr from-orange-500/10 via-amber-500/5 to-transparent rounded-full blur-3xl -z-10 opacity-80" />

      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-4xl font-bold tracking-tight text-zinc-900 leading-[1.12] mb-6"
        >
          <span className="inline-block relative h-[1.25em] overflow-hidden align-bottom min-w-[3.2ch] text-left">
            <AnimatePresence mode="wait">
              <motion.span
                key={words[currentWordIndex]}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block text-[#F44A00] font-extrabold h-full"
              >
                {words[currentWordIndex]}
              </motion.span>
            </AnimatePresence>
          </span>{" "}
          that works and <br className="hidden sm:inline" />
          converts.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-xl text-zinc-600 font-normal max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Hi, I&apos;m Chidera. I design mobile apps, websites, and digital experiences centered around clarity, strategy, and business growth.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="contact"
            className="inline-flex items-center gap-2.5 bg-[#F44A00] text-white font-semibold text-sm px-7 py-4 rounded-full hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-600/20 active:scale-95 transition-all duration-200 shadow-md group"
          >
            <span>Start a project</span>
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>

          <Link
            href="work"
            className="inline-flex items-center gap-2.5 border border-zinc-200 bg-white text-zinc-700 font-semibold text-sm px-7 py-4 rounded-full hover:border-orange-300 hover:text-[#F44A00] hover:bg-orange-50/30 active:scale-95 transition-all duration-200 shadow-sm"
          >
            <span>View selected work</span>
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;