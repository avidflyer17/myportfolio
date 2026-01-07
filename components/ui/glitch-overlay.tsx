"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const GLITCH_EVENT = 'navigation:glitch';

export function triggerGlitchNavigation() {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event(GLITCH_EVENT));
    }
}

export function GlitchOverlay() {
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const handleGlitch = () => {
            setIsActive(true);
            // Hide after 500ms (animation duration)
            setTimeout(() => setIsActive(false), 500);
        };

        window.addEventListener(GLITCH_EVENT, handleGlitch);
        return () => window.removeEventListener(GLITCH_EVENT, handleGlitch);
    }, []);

    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="fixed inset-0 z-[9999] pointer-events-none bg-black/10 mix-blend-exclusion"
                >
                    {/* Scanlines */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] animate-scanlines opacity-50" />

                    {/* Chromatic Aberration Shift */}
                    <motion.div
                        initial={{ x: -20, opacity: 0.5 }}
                        animate={{ x: 20, opacity: 0 }}
                        transition={{ duration: 0.2, yoyo: Infinity }}
                        className="absolute inset-0 bg-neon-cyan/10 mix-blend-screen translate-x-1"
                    />
                    <motion.div
                        initial={{ x: 20, opacity: 0.5 }}
                        animate={{ x: -20, opacity: 0 }}
                        transition={{ duration: 0.2, yoyo: Infinity }}
                        className="absolute inset-0 bg-neon-pink/10 mix-blend-screen -translate-x-1"
                    />

                    {/* Distortion Wipe */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"
                        style={{ skewX: '-20deg' }}
                    />

                    {/* Random Glitch Blocks */}
                    <div className="absolute top-1/4 left-0 w-full h-8 bg-neon-pink/20 animate-glitch-1" />
                    <div className="absolute top-2/3 right-0 w-full h-4 bg-neon-cyan/20 animate-glitch-2" />
                    <div className="absolute top-1/2 left-1/4 w-32 h-32 border border-white/50 rounded-full animate-ping opacity-20" />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
