"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

export function CyberLogo() {
    const [glitch, setGlitch] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setGlitch(true);
            setTimeout(() => setGlitch(false), 200);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-32 h-32 md:w-48 md:h-48 mb-8 mx-auto">
            {/* Holograhic Container */}
            <motion.div
                className="relative w-full h-full"
                initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.5, type: "spring" }}
            >
                {/* Main Logo Image */}
                <div className="relative z-10 w-full h-full overflow-hidden p-2">
                    <Image
                        src="/logo.webp"
                        alt="Logo"
                        fill
                        className="object-contain drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]"
                        priority
                    />

                    {/* Scanline Effect */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-cyan/20 to-transparent z-20 pointer-events-none"
                        animate={{ top: ["-100%", "100%"] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                        style={{ height: "50%" }}
                    />
                </div>

                {/* Glitch Layer (Offset Cyan) */}
                <motion.div
                    className="absolute inset-0 z-0 opacity-50 mix-blend-screen"
                    animate={glitch ? { x: [-2, 2, -1, 0], opacity: [0.5, 0.8, 0.5] } : {}}
                >
                    <div className="w-full h-full border border-neon-cyan/50 rounded-xl" />
                </motion.div>

                {/* Glitch Layer (Offset Pink) */}
                <motion.div
                    className="absolute inset-0 z-0 opacity-50 mix-blend-screen"
                    animate={glitch ? { x: [2, -2, 1, 0], opacity: [0.5, 0.8, 0.5] } : {}}
                >
                    <div className="w-full h-full border border-neon-pink/50 rounded-xl" />
                </motion.div>

                {/* Corner Brackets */}
                <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-neon-cyan" />
                <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-neon-cyan" />
                <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-neon-cyan" />
                <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-neon-cyan" />

            </motion.div>
        </div>
    );
}
