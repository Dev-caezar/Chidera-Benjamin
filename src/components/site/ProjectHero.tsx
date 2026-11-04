"use client";

import React, { useEffect, useRef } from "react";
import { ExternalLink, Globe, Layers, Compass, ArrowRight } from "lucide-react";

type Props = {
  project: {
    title: string;
    summary?: string;
    links?: { live?: string; prototype?: string; figma?: string };
  };
};

const linkItems = [
  { key: "live", label: "Live preview", icon: Globe },
  { key: "prototype", label: "Prototype", icon: Layers },
  { key: "figma", label: "Figma file", icon: Compass },
] as const;

const ProjectHero = ({ project }: Props) => {
  const { title, summary, links } = project;
  const availableLinks = linkItems.filter(({ key }) => links?.[key]);
  const primaryLiveLink = links?.live || links?.prototype;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Starfield Canvas Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      canvas.width = parent ? parent.clientWidth : window.innerWidth;
      canvas.height = parent ? parent.clientHeight : 400;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const starCount = 100;
    const stars = Array.from({ length: starCount }, (_, i) => ({
      x: Math.random() * (canvas.width || 1200),
      y: Math.random() * (canvas.height || 400),
      radius: Math.random() * 1.4 + 0.4,
      alpha: Math.random(),
      speed: Math.random() * 0.012 + 0.003,
      growing: Math.random() > 0.5,
      isBrandColor: i % 6 === 0,
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
    <section className="relative w-full min-h-95 bg-[#0B0301] py-16 lg:py-24 overflow-hidden border-b border-[#F44A00]/20">
      {/* Starfield Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block w-full h-full pointer-events-none z-0"
      />

      {/* Ambient Radial Brand Glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#F44A00]/20 blur-3xl rounded-full z-0" />

      <div className="relative z-10 mx-auto max-w-5xl space-y-8">
        {/* Title & Summary Stack */}
        <div className="space-y-6 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#160602] border border-[#F44A00]/30 text-[#F44A00] text-[11px] font-bold tracking-wider uppercase">
            Case Study
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
            {title}
          </h1>

          {summary && (
            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed font-normal">
              {summary}
            </p>
          )}
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          {primaryLiveLink && (
            <a
              href={primaryLiveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#F44A00] text-white text-xs sm:text-sm font-semibold shadow-lg shadow-[#F44A00]/25 hover:bg-orange-600 hover:shadow-[#F44A00]/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <span>Explore Live Project</span>
              <ArrowRight size={15} />
            </a>
          )}

          {availableLinks.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              {availableLinks.map(({ key, label, icon: Icon }) => (
                <a
                  key={key}
                  href={links![key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-[#160602]/90 border border-[#F44A00]/30 text-zinc-200 text-xs sm:text-sm font-medium hover:border-[#F44A00] hover:bg-[#F44A00] hover:text-white hover:-translate-y-0.5 transition-all duration-200 shadow-sm backdrop-blur-xs cursor-pointer"
                >
                  <Icon
                    size={15}
                    className="text-zinc-400 group-hover:text-white transition-colors"
                  />
                  <span>{label}</span>
                  <ExternalLink size={13} className="opacity-50 group-hover:opacity-100 transition-opacity ml-0.5" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectHero;