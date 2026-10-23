"use client";

import { useEffect, useState } from "react";
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

  const handleManualNavigate = (path: string) => {
    setIsExiting(true);
    setTimeout(() => router.push(path), 600);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{
          opacity: isExiting ? 0 : 1,
          scale: isExiting ? 0.96 : 1,
          filter: isExiting ? "blur(8px)" : "blur(0px)",
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-4xl mx-auto py-16 sm:py-24 px-6 flex flex-col items-center justify-center text-center font-sans"
      >
        <div className="absolute inset-0 bg-[radial-gradient(#e4e4e7_1.5px,transparent_1.5px)] bg-size-[32px_32px] opacity-40 pointer-events-none -z-10" />

        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 h-100 bg-linear-to-tr from-orange-500/10 via-amber-500/5 to-transparent rounded-full blur-3xl -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-md w-full flex flex-col items-center space-y-6"
        >
          <div className="inline-flex items-center gap-2 p-1.5 pl-3 rounded-full bg-zinc-900/5 backdrop-blur-md border border-zinc-200/80 shadow-2xs transition-all duration-300 hover:border-zinc-300">
            <div className="flex items-center gap-2 pr-1 border-r border-zinc-200/80">
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F44A00] ${isPaused ? "hidden" : "opacity-75"
                    }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${isPaused ? "bg-zinc-400" : "bg-[#F44A00]"
                    }`}
                />
              </span>
              <span className="font-mono text-[11px] font-medium text-zinc-600 tracking-tight">
                {isPaused ? "Redirect Paused" : `Redirecting in ${Math.max(0, Math.ceil((100 - progress) / 30))}s`}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-1.5 rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-white/80 transition-all cursor-pointer"
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
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-zinc-900 text-white text-[11px] font-semibold hover:bg-[#F44A00] transition-all duration-300 shadow-xs group cursor-pointer"
              >
                <span>Skip</span>
                <ArrowRight
                  size={11}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </button>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-2 bg-linear-to-b from-[#F44A00]/20 to-transparent rounded-full blur-xl opacity-60 group-hover:opacity-100 transition duration-700" />

            <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-white shadow-2xl bg-zinc-100">
              <Image
                src={chideraImage}
                alt="Chidera Benjamin"
                fill
                priority
                sizes="(max-width: 768px) 128px, 144px"
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>

            <div className="absolute bottom-1 right-1 bg-[#F44A00] text-white p-2 rounded-xl shadow-lg border-2 border-white">
              <Sparkles size={13} className="text-white" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 border border-orange-200/80 text-orange-700 text-[11px] font-bold tracking-wider uppercase">
              Product Designer
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl font-black tracking-tight text-zinc-900">
              Chidera Benjamin
            </h1>

            <p className="text-sm text-zinc-500 font-normal max-w-xs mx-auto leading-relaxed">
              Crafting high-end digital systems and intentional user experiences.
            </p>
          </div>

          <div className="w-full max-w-xs space-y-2 pt-4">
            <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden p-0.5 border border-zinc-200/60">
              <motion.div
                className="h-2 bg-[#F44A00] rounded-full"
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
  );
}