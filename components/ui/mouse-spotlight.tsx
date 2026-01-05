"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export function MouseSpotlight() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    // Smooth physics for the glow (laggy follow for elegance)
    const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
    const springX = useSpring(0, springConfig);
    const springY = useSpring(0, springConfig);

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
            springX.set(e.clientX);
            springY.set(e.clientY);
        };

        const updateHoverState = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isClickable = target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a');
            setIsHovering(!!isClickable);
        }

        window.addEventListener("mousemove", updateMousePosition);
        window.addEventListener("mouseover", updateHoverState);

        return () => {
            window.removeEventListener("mousemove", updateMousePosition);
            window.removeEventListener("mouseover", updateHoverState);
        };
    }, [springX, springY]);

    return (
        <div className="hidden md:block fixed top-0 left-0 w-full h-full pointer-events-none z-[100] overflow-hidden mix-blend-screen">

            {/* 1. Large Ambient Glow (Laggy & Smooth) */}
            <motion.div
                className="absolute top-0 left-0 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(0,243,255,0.15)_0%,transparent_70%)] rounded-full -translate-x-1/2 -translate-y-1/2"
                style={{
                    x: springX,
                    y: springY,
                }}
            />

            {/* 2. Intense Core Glow (Laggy & Smooth) */}
            <motion.div
                className="absolute top-0 left-0 w-[200px] h-[200px] bg-[radial-gradient(circle,rgba(0,243,255,0.4)_0%,transparent_70%)] rounded-full -translate-x-1/2 -translate-y-1/2 blur-xl"
                style={{
                    x: springX,
                    y: springY,
                }}
            />

            {/* 3. Tactical Cursor Ring (Snappy) */}
            <motion.div
                className={`absolute top-0 left-0 w-8 h-8 rounded-full border border-neon-cyan/80 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 z-10 flex items-center justify-center ${isHovering ? 'scale-[2.5] bg-neon-cyan/20 border-neon-pink' : 'scale-100'}`}
                animate={{
                    x: mousePosition.x,
                    y: mousePosition.y
                }}
                transition={{ type: "tween", ease: "linear", duration: 0 }}
            >
                {/* Center Dot */}
                <div className={`w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white] transition-colors duration-200 ${isHovering ? 'bg-neon-pink' : ''}`} />
            </motion.div>
        </div>
    );
}
