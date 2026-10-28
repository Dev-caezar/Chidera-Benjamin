"use client";

import React, { useEffect, useRef } from "react";

export default function LoginStarfield() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;

        const resizeCanvas = () => {
            canvas.width = canvas.parentElement?.clientWidth || 600;
            canvas.height = canvas.parentElement?.clientHeight || 800;
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        const starCount = 100;
        const stars = Array.from({ length: starCount }, (_, i) => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.2 + 0.3,
            alpha: Math.random(),
            speed: Math.random() * 0.01 + 0.003,
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
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-0"
        />
    );
}