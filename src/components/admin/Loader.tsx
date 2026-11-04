"use client";

import { motion } from "framer-motion";

interface DashboardLoaderProps {
    label?: string;
    sublabel?: string;
    fullScreen?: boolean;
}

export default function DashboardLoader({
    label = "Loading Dashboard",
    sublabel = "Fetching latest project metrics and system state...",
    fullScreen = false,
}: DashboardLoaderProps) {
    return (
        <div
            className={`flex flex-col items-center justify-center bg-white font-sans ${fullScreen
                ? "fixed inset-0 z-50 min-h-screen w-full"
                : "relative h-96 w-full"
                }`}
        >
            <div className="absolute inset-0 bg-[radial-gradient(#e4e4e7_1.5px,transparent_1.5px)] bg-size-[24px_24px] opacity-40 pointer-events-none rounded-inherit" />

            <div className="relative z-10 flex flex-col items-center text-center max-w-sm px-4">
                <motion.div
                    className="relative w-20 h-20 mb-6 grid grid-cols-2 gap-2 p-1"
                    animate={{ rotate: 360 }}
                    transition={{
                        repeat: Infinity,
                        duration: 1.2,
                        ease: "easeInOut",
                    }}
                >
                    {[0, 1, 2, 3].map((index) => (
                        <motion.span
                            key={index}
                            className="w-6  h-6  rounded-full bg-[#F44A00] shadow-[0_0_10px_rgba(244,74,0,0.35)]"
                            animate={{
                                scale: [0.8, 1.2, 0.8],
                                opacity: [0.6, 1, 0.6],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 1.2,
                                ease: "easeInOut",
                                delay: index * 0.15,
                            }}
                        />
                    ))}
                </motion.div>

                <div className="space-y-1">
                    <h3 className="text-base font-bold tracking-tight text-zinc-900">
                        {label}
                    </h3>

                    {sublabel && (
                        <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                            {sublabel}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}