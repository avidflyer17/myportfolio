"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from "framer-motion";
import { Radio, Cpu } from "lucide-react";
import { useNeuralInterface, CONTACT_VIEW_SIGNAL } from "@/components/features/neural-interface";
import { ClassicContactForm } from "@/components/features/classic-contact-form";
import { cn } from '@/lib/utils';

export function ContactSection() {
    const t = useTranslations('contact');
    const { open } = useNeuralInterface();
    const [view, setView] = useState<'ai' | 'classic'>('ai');

    // Listen for AI fallback redirection signal
    useEffect(() => {
        const handleSwitchSignal = (e: Event) => {
            const customEvent = e as CustomEvent<string>;
            if (customEvent.detail === 'classic') {
                setView('classic');
            }
        };
        window.addEventListener(CONTACT_VIEW_SIGNAL, handleSwitchSignal);
        return () => window.removeEventListener(CONTACT_VIEW_SIGNAL, handleSwitchSignal);
    }, []);

    return (
        <section id="contact" className="py-20 md:py-32 relative overflow-hidden w-full min-h-screen flex items-center justify-center">

            {/* Background Grid Decoration */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center px-4 w-full">

                {/* Protocol Header */}
                <div className="mb-12 md:mb-16 space-y-6 w-full flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-black/50 border border-white/10 text-[10px] font-mono tracking-[0.3em] text-slate-500 uppercase"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_8px_#00f3ff]" />
                        System_Protocol_Selection
                    </motion.div>

                    <h2 className="text-4xl md:text-7xl font-black text-white italic tracking-tighter uppercase text-center">
                        INITIATE <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-pink drop-shadow-[0_0_15px_rgba(0,243,255,0.3)]">transmission</span>
                    </h2>

                    {/* NEXT-GEN SWITCHER */}
                    <div className="relative p-1 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 flex items-center gap-1">
                        <motion.div
                            className="absolute inset-y-1 rounded-lg bg-gradient-to-r from-neon-cyan/20 to-neon-pink/20 border border-white/20 shadow-[0_0_20px_rgba(0,243,255,0.1)]"
                            initial={false}
                            animate={{
                                x: view === 'ai' ? 0 : '100%',
                            }}
                            style={{ width: 'calc(50% - 4px)' }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />

                        <button
                            onClick={() => setView('ai')}
                            className={cn(
                                "relative z-10 px-4 md:px-6 py-3 rounded-lg text-xs font-mono uppercase tracking-widest transition-all duration-300 flex items-center gap-2 md:gap-3",
                                view === 'ai' ? "text-neon-cyan" : "text-slate-500 hover:text-slate-300"
                            )}
                        >
                            <Radio size={14} className={view === 'ai' ? "animate-pulse" : ""} />
                            Neural_Link
                        </button>

                        <button
                            onClick={() => setView('classic')}
                            className={cn(
                                "relative z-10 px-4 md:px-6 py-3 rounded-lg text-xs font-mono uppercase tracking-widest transition-all duration-300 flex items-center gap-2 md:gap-3",
                                view === 'classic' ? "text-neon-pink" : "text-slate-500 hover:text-slate-300"
                            )}
                        >
                            <Cpu size={14} />
                            Standard
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {view === 'ai' ? (
                        <motion.div
                            key="ai-view"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                            className="flex flex-col items-center gap-8 w-full max-w-2xl"
                        >
                            <div className="bg-black/40 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] border border-white/5 relative overflow-hidden group w-full text-center">
                                <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 via-transparent to-transparent opacity-50" />

                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="w-24 h-24 md:w-32 md:h-32 border-2 border-dashed border-neon-cyan/20 rounded-full mx-auto mb-8 flex items-center justify-center relative"
                                >
                                    <div className="absolute inset-0 border-2 border-neon-cyan/40 rounded-full animate-ping [animation-duration:3s]" />
                                    <Radio className="w-10 h-10 md:w-12 md:h-12 text-neon-cyan drop-shadow-[0_0_15px_#00f3ff]" />
                                </motion.div>

                                <p className="text-slate-400 mb-10 text-base md:text-lg leading-relaxed max-w-md mx-auto">
                                    {t('secureChannel')}
                                </p>

                                <motion.button
                                    onClick={() => open()}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-6 rounded-2xl bg-neon-cyan text-black font-black text-sm tracking-[0.3em] uppercase italic group-hover:shadow-[0_0_50px_rgba(0,243,255,0.4)] transition-all duration-500 relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                    Establish_neural_link
                                </motion.button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="classic-view"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                            className="w-full"
                        >
                            <ClassicContactForm />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Decorative Elements */}
                <div className="absolute left-10 bottom-10 opacity-20 pointer-events-none hidden lg:block">
                    <div className="font-mono text-[8px] space-y-1 text-neon-cyan">
                        <p>COORD_LAT: 43.6047</p>
                        <p>COORD_LON: 1.4442</p>
                        <p>SEC_LEVEL: ALPHA_MAX</p>
                    </div>
                </div>

                <div className="absolute right-10 bottom-10 opacity-20 pointer-events-none hidden lg:block">
                    <pre className="font-mono text-[8px] text-neon-pink text-right leading-tight">
                        {`0x4A 0xDB 0x3F 0x92
0xBC 0x4D 0xE1 0x05
0x98 0x33 0xFF 0x1A
LINK_STATUS: STABLE`}
                    </pre>
                </div>

            </div>
        </section>
    );
}
