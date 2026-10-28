"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Sparkles, Pause, Play, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import chideraImage from "@/images/chidera.png";

export default function Home() {
  const router = useRouter();
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Auto-redirect timer logic
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExiting(true);
          setTimeout(() => router.push("/about"), 600);
          return 100;
        }
        return prev + 1.6;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPaused, router]);

  // Starfield Canvas Background Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const starCount = 120;
    const stars = Array.from({ length: starCount }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.3 + 0.3,
      alpha: Math.random(),
      speed: Math.random() * 0.012 + 0.003,
      growing: Math.random() > 0.5,
      isBrandColor: i % 7 === 0,
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

  const handleManualNavigate = (path: string) => {
    setIsExiting(true);
    setTimeout(() => router.push(path), 600);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0B0301] flex items-center justify-center overflow-hidden">
      {/* Starfield Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
      />

      {/* Ambient Brand Glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#F44A00]/15 blur-3xl rounded-full z-0" />

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{
            opacity: isExiting ? 0 : 1,
            scale: isExiting ? 0.96 : 1,
            filter: isExiting ? "blur(8px)" : "blur(0px)",
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-4xl mx-auto py-16 sm:py-24 px-6 flex flex-col items-center justify-center text-center font-sans"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-md w-full flex flex-col items-center space-y-6"
          >
            {/* Redirect Control Pill */}
            <div className="inline-flex items-center gap-2 p-1.5 pl-3 rounded-full bg-[#160602]/90 backdrop-blur-md border border-[#F44A00]/30 shadow-md">
              <div className="flex items-center gap-2 pr-2 border-r border-[#F44A00]/20">
                <span className="relative flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F44A00] ${isPaused ? "hidden" : "opacity-75"
                      }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${isPaused ? "bg-zinc-500" : "bg-[#F44A00]"
                      }`}
                  />
                </span>
                <span className="font-mono text-[11px] font-medium text-zinc-300 tracking-tight">
                  {isPaused
                    ? "Redirect Paused"
                    : `Redirecting in ${Math.max(
                      0,
                      Math.ceil((100 - progress) / 30)
                    )}s`}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                  title={isPaused ? "Resume auto-redirect" : "Pause auto-redirect"}
                  aria-label={isPaused ? "Resume auto-redirect" : "Pause auto-redirect"}
                >
                  {isPaused ? (
                    <Play size={12} className="text-[#F44A00] fill-[#F44A00]" />
                  ) : (
                    <Pause size={12} />
                  )}
                </button>

                <button
                  onClick={() => handleManualNavigate("/about")}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F44A00] text-white text-[11px] font-semibold hover:bg-orange-600 transition-all duration-300 shadow-xs group cursor-pointer"
                >
                  <span>Skip</span>
                  <ArrowRight
                    size={11}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </button>
              </div>
            </div>

            {/* Profile Avatar Card */}
            <div className="relative group">
              <div className="absolute -inset-2 bg-[#F44A00]/30 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition duration-700" />

              <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-[#F44A00]/40 shadow-2xl bg-[#160602]">
                <Image
                  src={chideraImage}
                  alt="Chidera Benjamin"
                  fill
                  priority
                  sizes="(max-width: 768px) 128px, 144px"
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>

              <div className="absolute bottom-1 right-1 bg-[#F44A00] text-white p-2 rounded-xl shadow-lg border-2 border-[#0B0301]">
                <Sparkles size={13} className="text-white" />
              </div>
            </div>

            {/* Name & Title */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#160602] border border-[#F44A00]/30 text-[#F44A00] text-[11px] font-bold tracking-wider uppercase">
                Product Designer
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl font-black tracking-tight text-white">
                Chidera Benjamin
              </h1>

              <p className="text-sm text-zinc-400 font-normal max-w-xs mx-auto leading-relaxed">
                Crafting high-end digital systems and intentional user experiences.
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-xs space-y-2 pt-4">
              <div className="w-full bg-[#160602] h-1.5 rounded-full overflow-hidden p-0.5 border border-[#F44A00]/20">
                <motion.div
                  className="h-full bg-[#F44A00] rounded-full shadow-[0_0_8px_#F44A00]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "linear", duration: 0.05 }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 px-1">
                <span>{isPaused ? "Paused" : "Loading portfolio..."}</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}