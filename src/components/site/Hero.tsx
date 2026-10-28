"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

const words = ["Design", "Product", "Website", "Brand"];

const Hero = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  // Canvas Starfield Background Effect (Matching Header & Footer)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || 600;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Generate random star data
    const starCount = 140;
    const stars = Array.from({ length: starCount }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.3 + 0.3,
      alpha: Math.random(),
      speed: Math.random() * 0.012 + 0.003,
      growing: Math.random() > 0.5,
      isBrandColor: i % 7 === 0, // ~15% brand orange stars
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

        if (star.isBrandColor) {
          ctx.fillStyle = `rgba(244, 74, 0, ${star.alpha})`;
          ctx.shadowBlur = 6;
          ctx.shadowColor = "#F44A00";
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
          ctx.shadowBlur = star.radius > 1 ? 4 : 0;
          ctx.shadowColor = "#ffffff";
        }

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
    <section className="relative w-full bg-[#0B0301] py-32 md:py-44 px-6 overflow-hidden border-b border-[#F44A00]/20">
      {/* Ambient Brand Glows */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-80 bg-[#F44A00]/15 blur-3xl rounded-full -z-10" />

      {/* Starfield Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-[1.12] mb-6"
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
          className="text-base sm:text-xl text-zinc-400 font-normal max-w-2xl mx-auto leading-relaxed mb-10"
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
            href="/#contact"
            className="inline-flex items-center gap-2.5 bg-[#F44A00] text-white font-semibold text-sm px-7 py-4 rounded-full hover:bg-orange-600 hover:shadow-lg hover:shadow-[#F44A00]/30 active:scale-95 transition-all duration-200 shadow-md group cursor-pointer"
          >
            <span>Start a project</span>
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>

          <Link
            href="/work"
            className="inline-flex items-center gap-2.5 border border-[#F44A00]/30 bg-[#160602]/80 text-zinc-100 font-semibold text-sm px-7 py-4 rounded-full hover:border-[#F44A00] hover:bg-[#F44A00] active:scale-95 transition-all duration-300 shadow-sm backdrop-blur-xs cursor-pointer"
          >
            <span>View selected work</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;