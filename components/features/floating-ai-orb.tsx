"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FloatingAIOrbProps {
    onClick: () => void;
}

export function FloatingAIOrb({ onClick }: FloatingAIOrbProps) {
    const [showWelcome, setShowWelcome] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    // Show welcome message after 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => setShowWelcome(true), 3000);
        const hideTimer = setTimeout(() => setShowWelcome(false), 8000);

        return () => {
            clearTimeout(timer);
            clearTimeout(hideTimer);
        };
    }, []);

    // Hide welcome on first scroll
    useEffect(() => {
        const handleScroll = () => setShowWelcome(false);
        window.addEventListener('scroll', handleScroll, { once: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Orbital particles
    const particles = [
        { angle: 0, delay: 0, radius: 35 },
        { angle: 120, delay: 0.5, radius: 40 },
        { angle: 240, delay: 1, radius: 38 }
    ];

    return (
        <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[100] pointer-events-none">
            {/* Welcome Tooltip */}
            <AnimatePresence>
                {showWelcome && (
                    <motion.div
                        initial={{ opacity: 0, x: 20, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.9 }}
                        className="absolute bottom-20 right-0 bg-black/90 backdrop-blur-xl border border-neon-cyan/30 rounded-lg p-3 pr-4 pointer-events-none shadow-[0_0_30px_rgba(0,243,255,0.3)]"
                        style={{ width: '200px' }}
                    >
                        <div className="flex items-start gap-2">
                            <MessageCircle className="w-4 h-4 text-neon-cyan flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-slate-300 font-mono leading-relaxed">
                                💬 <span className="text-neon-cyan">Besoin d'aide ?</span> Je suis là !
                            </p>
                        </div>
                        {/* Arrow */}
                        <div className="absolute -bottom-2 right-8 w-4 h-4 bg-black/90 border-r border-b border-neon-cyan/30 rotate-45" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Orb Container */}
            <div className="relative pointer-events-auto">
                {/* Orbital Particles */}
                {particles.map((p, i) => (
                    <motion.div
                        key={i}
                        className="absolute"
                        animate={{
                            rotate: 360
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear",
                            delay: p.delay
                        }}
                        style={{
                            left: '50%',
                            top: '50%',
                            marginLeft: -1,
                            marginTop: -1
                        }}
                    >
                        <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                                background: i % 2 === 0 ? '#00f3ff' : '#ff00ff',
                                boxShadow: `0 0 8px currentColor`,
                                transform: `translateX(${p.radius}px)`
                            }}
                        />
                    </motion.div>
                ))}

                {/* Main Orb */}
                <motion.button
                    onClick={onClick}
                    onHoverStart={() => setIsHovering(true)}
                    onHoverEnd={() => setIsHovering(false)}
                    className="relative w-14 h-14 md:w-16 md:h-16 rounded-full cursor-pointer group border-2 border-neon-cyan/30 overflow-hidden"
                    animate={{
                        scale: isHovering ? [1, 1.05, 1] : [1, 1.08, 1],
                        boxShadow: isHovering
                            ? [
                                '0 0 30px rgba(0,243,255,0.8)',
                                '0 0 50px rgba(0,243,255,1), 0 0 30px rgba(255,0,255,0.5)',
                                '0 0 30px rgba(0,243,255,0.8)'
                            ]
                            : [
                                '0 0 20px rgba(0,243,255,0.6)',
                                '0 0 35px rgba(0,243,255,0.8)',
                                '0 0 20px rgba(0,243,255,0.6)'
                            ]
                    }}
                    transition={{
                        duration: isHovering ? 1 : 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Ouvrir l'assistant IA"
                >
                    {/* Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/20 via-neon-pink/20 to-neon-cyan/20 group-hover:from-neon-cyan/30 group-hover:via-neon-pink/30 group-hover:to-neon-cyan/30 transition-all duration-300" />

                    {/* Rotating Gradient Overlay */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-transparent via-neon-cyan/20 to-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Icon */}
                    <div className="relative flex items-center justify-center w-full h-full">
                        <motion.div
                            animate={isHovering ? {
                                rotate: [0, 5, -5, 0],
                                scale: [1, 1.1, 1]
                            } : {}}
                            transition={{ duration: 0.5 }}
                        >
                            <Cpu
                                className="w-6 h-6 md:w-7 md:h-7 text-neon-cyan"
                                style={{
                                    filter: 'drop-shadow(0 0 8px rgba(0,243,255,0.8))'
                                }}
                            />
                        </motion.div>
                    </div>

                    {/* Pulse Ring */}
                    <motion.div
                        className="absolute inset-0 rounded-full border-2 border-neon-cyan"
                        animate={{
                            scale: [1, 1.5],
                            opacity: [0.5, 0]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeOut"
                        }}
                    />
                </motion.button>

                {/* Hover Tooltip */}
                <AnimatePresence>
                    {isHovering && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            className="absolute bottom-full right-0 mb-3 bg-black/90 backdrop-blur-xl border border-neon-cyan/30 rounded px-3 py-1.5 whitespace-nowrap pointer-events-none"
                        >
                            <p className="text-xs text-neon-cyan font-mono tracking-wide">
                                Architecte Neuronal
                            </p>
                            {/* Arrow */}
                            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-black/90 border-r border-b border-neon-cyan/30 rotate-45" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
