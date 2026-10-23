"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, Variants } from "framer-motion";
import chideraImage from "@/images/chidera.png";

type AboutProps = {
    userImage?: string | StaticImageData;
};

// Motion Variants for clean staggered entry
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.05,
        },
    },
};


const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1] as const,
        },
    },
};

const imageVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1] as const,
            delay: 0.2,
        },
    },
};

const About = ({ userImage = chideraImage }: AboutProps) => {
    return (
        <section className="relative isolate mx-auto max-w-6xl overflow-hidden px-6 py-20 lg:py-28 font-sans">
            <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-100 w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-b from-orange-500/10 via-transparent to-transparent blur-3xl" />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16"
            >
                <div className="space-y-6 lg:col-span-7">
                    <motion.h1
                        variants={itemVariants}
                        className="font-heading text-2xl sm:text-4xl lg:text-4xl font-bold leading-[1.15] tracking-tight text-zinc-900"
                    >
                        Hi, I&apos;m Chidera <span className="text-[#F44A00]">—</span> a
                        product designer in Lagos.
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="max-w-xl text-base sm:text-lg font-normal leading-relaxed text-zinc-600"
                    >
                        I help founders and teams turn complex ideas into simple, intuitive
                        digital products that users understand, trust and keep coming back
                        to.
                    </motion.p>

                    <motion.div
                        variants={itemVariants}
                        className="flex flex-wrap items-center gap-4 pt-4"
                    >
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 rounded-xl bg-[#F44A00] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-orange-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-600"
                        >
                            <span>Let&apos;s Build Your Product</span>
                            <ArrowRight size={16} />
                        </Link>

                        <Link
                            href="/work"
                            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200/90 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50/40 hover:text-[#F44A00]"
                        >
                            <span>See my work</span>
                        </Link>
                    </motion.div>
                </div>

                <motion.div
                    variants={imageVariants}
                    className="flex justify-center lg:col-span-5 lg:justify-end"
                >
                    <div className="group relative aspect-square w-full max-w-sm overflow-hidden rounded-full border border-zinc-200/80 bg-[#F44A00] shadow-2xl shadow-zinc-950/10 transition-transform duration-500 hover:scale-[1.01]">
                        {userImage ? (
                            <div className="group relative aspect-square w-full max-w-xs mx-auto overflow-hidden rounded-full bg-orange-100/60 p-2 border border-[#f54a0079] shadow-xl transition-transform duration-500 hover:scale-[1.02]">
                                <div className="relative h-full w-full overflow-hidden rounded-full bg-black">
                                    <Image
                                        src={userImage}
                                        alt="Chidera, product designer"
                                        fill
                                        priority
                                        sizes="(min-width: 1024px) 35vw, 100vw"
                                        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-zinc-100 text-sm font-medium text-zinc-400">
                                Add User Image
                            </div>
                        )}
                        <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/5" />
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default About;