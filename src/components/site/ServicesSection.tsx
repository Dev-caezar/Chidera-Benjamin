"use client";

import React, { useState } from "react";
import { Sparkles, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ServiceItem {
  number: string;
  title: string;
  description: string;
}

const services: ServiceItem[] = [
  {
    number: "01",
    title: "Product Design (UI/UX)",
    description:
      "End-to-end user experience and interface design for mobile & web apps, structured around clear user research, intuitive workflows, and design systems.",
  },
  {
    number: "02",
    title: "Framer Development",
    description:
      "Translating bespoke Figma designs into fast, responsive Framer websites featuring smooth micro-interactions and clean CMS setup.",
  },
  {
    number: "03",
    title: "UX Audits & Redesigns",
    description:
      "Evaluating existing products to eliminate friction points, elevate overall visual craft, and drive higher engagement and conversions.",
  },
];

export default function ServicesSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="services" className="bg-[#F44A00] py-20 px-6 sm:px-12 md:px-16 font-sans text-white">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

        {/* Left Header Area */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-28">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/80">
            <Sparkles size={13} className="text-white" />
            <span>Capabilities</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Build. Design. <br className="hidden sm:inline" />
            Launch.
          </h2>

          <p className="text-white/80 text-sm sm:text-base leading-relaxed font-normal pt-2">
            Partnering with founders and product teams to transform ideas into clear, high-converting digital experiences.
          </p>
        </div>

        {/* Right Accordion List Area */}
        <div className="lg:col-span-7 divide-y divide-white/20 border-t border-b border-white/20">
          {services.map((service, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={service.number} className="group">
                {/* Accordion Trigger */}
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full py-6 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-white/60">
                      {service.number}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:translate-x-1 transition-transform duration-300">
                      {service.title}
                    </h3>
                  </div>

                  {/* Plus / Minus Indicator */}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all duration-300 group-hover:bg-white group-hover:text-[#F44A00]">
                    {isOpen ? <Minus size={15} /> : <Plus size={15} />}
                  </div>
                </button>

                {/* Collapsible Content with Smooth Framer Motion Transition */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-6 pl-7 pr-4">
                        <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal">
                          {service.description}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}