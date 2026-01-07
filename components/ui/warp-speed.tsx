"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function WarpSpeed({ active }: { active: boolean }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!active || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const stars: { x: number; y: number; z: number; o: number }[] = [];
        const STAR_COUNT = 400;
        let speed = 0.1;

        // Initialize stars
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: (Math.random() - 0.5) * width,
                y: (Math.random() - 0.5) * height,
                z: Math.random() * width,
                o: Math.random() // offset for color/size variety
            });
        }

        let animationFrameId: number;

        const render = () => {
            // Speed up simulation
            speed = speed < 20 ? speed * 1.05 : 20;

            ctx.fillStyle = "rgba(0, 0, 0, 0.3)"; // Trail effect
            ctx.fillRect(0, 0, width, height);

            const cx = width / 2;
            const cy = height / 2;

            stars.forEach((star) => {
                // Move star closer
                star.z -= speed;

                // Reset logic
                if (star.z <= 0) {
                    star.z = width;
                    star.x = (Math.random() - 0.5) * width;
                    star.y = (Math.random() - 0.5) * height;
                }

                // Project to 2D
                const k = 128.0 / star.z;
                const px = star.x * k + cx;
                const py = star.y * k + cy;

                if (px >= 0 && px <= width && py >= 0 && py <= height) {
                    const size = (1 - star.z / width) * 4;
                    const shade = Math.floor((1 - star.z / width) * 255);

                    // Draw Streak
                    ctx.beginPath();
                    const prevK = 128.0 / (star.z + speed * 2); // Previous position calculation
                    const prevPx = star.x * prevK + cx;
                    const prevPy = star.y * prevK + cy;

                    ctx.strokeStyle = `rgb(${shade}, ${shade}, 255)`; // Blue-ish white
                    ctx.lineWidth = size;
                    ctx.moveTo(prevPx, prevPy);
                    ctx.lineTo(px, py);
                    ctx.stroke();
                }
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, [active]);

    if (!active) return null;

    return (
        <motion.canvas
            ref={canvasRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] pointer-events-none mix-blend-screen"
        />
    );
}
