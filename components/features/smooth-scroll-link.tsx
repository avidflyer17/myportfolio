"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { smoothScrollTo } from "@/lib/smooth-scroll";
import { cn } from "@/lib/utils";

interface SmoothScrollLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    onClick?: (e: React.MouseEvent) => void;
}

export function SmoothScrollLink({ href, children, className, onClick }: SmoothScrollLinkProps) {
    const [isGlitching, setIsGlitching] = useState(false);

    const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        if (onClick) onClick(e);

        // 1. Trigger Glitch Effect
        setIsGlitching(true);

        // 2. Play sound effect (optional/future)
        // playWarpSound();

        // 3. Wait for effect then scroll
        setTimeout(() => {
            const targetId = href.replace('#', '');
            smoothScrollTo(e, targetId);

            // Reset glitch after scroll starts
            setTimeout(() => {
                setIsGlitching(false);
            }, 300);
        }, 200);

    }, [href, onClick]);

    return (
        <>
            <a
                href={href}
                onClick={handleClick}
                className={cn("relative group cursor-pointer", className)}
            >
                {children}
            </a>

            {/* Global Screen Glitch Overlay - Only renders when this specific link triggers it */}
            <AnimatePresence>
                {isGlitching && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                        className="fixed inset-0 z-[100] pointer-events-none bg-neon-cyan/10 mix-blend-difference"
                    >
                        {/* Scanlines */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] animate-scanlines" />

                        {/* Distortion Wipe */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"
                            style={{ skewX: '-20deg' }}
                        />

                        {/* Random Glitch Blocks */}
                        <div className="absolute top-1/4 left-0 w-full h-2 bg-neon-pink/50 animate-glitch-1" />
                        <div className="absolute top-2/3 right-0 w-full h-1 bg-neon-cyan/50 animate-glitch-2" />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

// Add these keyframes to your globals.css if not present, or assume Tailwind arbitrary values if configured
// For now, relying on standard Tailwind or we might need to inject styles.
