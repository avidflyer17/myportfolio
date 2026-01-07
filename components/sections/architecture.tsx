"use client";

import { useTranslations } from 'next-intl';
import { GlassPanel } from "@/components/ui/glass-panel";
import { motion } from "framer-motion";
import { Server, Database, Shield, Cpu, Cloud, Terminal, Layers, Hash, Github, FileText, ArrowUpRight, ChevronRight } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { CityMap } from "@/components/canvas/city-map";
import { OrbitControls } from "@react-three/drei";
import { CTAButton } from "@/components/ui/cta-button";
import { smoothScrollTo } from "@/lib/smooth-scroll";
import { useState } from "react";
import { CVModal } from "@/components/features/cv-modal";

export function ArchitectureSection() {
    const t = useTranslations('architecture');
    const [isCVOpen, setIsCVOpen] = useState(false);

    return (
        <section id="architecture" className="py-24 relative overflow-hidden w-full min-h-screen flex flex-col justify-center">
            {/* Smooth Transition Gradient (Fade in/out to blend with stars) */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/90 to-transparent z-0" />

            {/* Background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neon-cyan/5 via-transparent to-transparent opacity-50 z-0" />

            {/* Widescreen Side Decorations (Hidden on mobile) */}
            <div className="hidden 2xl:flex flex-col justify-between absolute left-8 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-neon-cyan/30 to-transparent">
                <div className="absolute -left-1 top-0 w-2 h-2 bg-neon-cyan rounded-full animate-ping" />
                <div className="absolute -left-20 top-1/2 -rotate-90 text-[10px] font-mono text-neon-cyan/50 tracking-[0.3em] whitespace-nowrap">
                    SYSTEM_ARCHITECTURE_V.2.0.4
                </div>
                <div className="flex flex-col gap-4 pl-4 text-[10px] font-mono text-neon-cyan/40">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <span key={i} className="opacity-50">0x0{i}F{9 - i}</span>
                    ))}
                </div>
            </div>

            <div className="hidden 2xl:flex flex-col justify-between absolute right-8 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-neon-pink/30 to-transparent">
                <div className="absolute -right-1 bottom-0 w-2 h-2 bg-neon-pink rounded-full animate-ping" />
                <div className="absolute -right-20 top-1/2 rotate-90 text-[10px] font-mono text-neon-pink/50 tracking-[0.3em] whitespace-nowrap">
                    SECURE_ENVIRONMENT_DETECTED
                </div>
                <div className="flex flex-col gap-4 pr-4 text-[10px] font-mono text-neon-pink/40 text-right">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <span key={i} className="opacity-50">::INIT::{i}</span>
                    ))}
                </div>
            </div>

            <div className="w-full px-4 md:px-12 relative z-10">
                {/* Section Header */}
                <div className="flex flex-col items-center mb-12 text-center">
                    <motion.h2
                        className="text-2xl sm:text-4xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-white tracking-widest break-all md:break-normal"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        {t('coreArchitecture')}
                    </motion.h2>
                    <div className="flex items-center gap-4 mt-6">
                        <div className="h-px w-24 bg-gradient-to-r from-transparent to-neon-pink/50" />
                        <div className="text-neon-pink font-mono text-sm tracking-[0.3em] font-bold uppercase">
                            {t('scalableDesign')}
                        </div>
                        <div className="h-px w-24 bg-gradient-to-l from-transparent to-neon-pink/50" />
                    </div>
                </div>

                {/* Main Widescreen Layout */}
                <div className="relative h-[800px] md:h-[700px] w-full max-w-[95%] mx-auto grid grid-cols-1 md:grid-cols-[350px_1fr_350px] gap-8">

                    {/* DATA FLOW OVERLAY */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden md:block">
                        <defs>
                            <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#00f3ff" stopOpacity="0" />
                                <stop offset="50%" stopColor="#00f3ff" stopOpacity="1" />
                                <stop offset="100%" stopColor="#ff00ff" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        {/* Lines from Left Cards to Center - Distributing targets */}
                        <motion.line
                            x1="350" y1="150" x2="45%" y2="40%"
                            stroke="url(#flow-gradient)"
                            strokeWidth="2"
                            initial={{ pathLength: 0, opacity: 0 }}
                            whileInView={{ pathLength: 1, opacity: 0.8 }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                        />
                        <motion.line
                            x1="350" y1="350" x2="42%" y2="55%"
                            stroke="url(#flow-gradient)"
                            strokeWidth="2"
                            initial={{ pathLength: 0, opacity: 0 }}
                            whileInView={{ pathLength: 1, opacity: 0.8 }}
                            transition={{ duration: 1.5, delay: 0.7 }}
                        />
                        <motion.line
                            x1="350" y1="550" x2="48%" y2="65%"
                            stroke="url(#flow-gradient)"
                            strokeWidth="2"
                            initial={{ pathLength: 0, opacity: 0 }}
                            whileInView={{ pathLength: 1, opacity: 0.8 }}
                            transition={{ duration: 1.5, delay: 0.9 }}
                        />

                        {/* Lines from Right Cards to Center - Distributing targets */}
                        <motion.line
                            x1="calc(100% - 350px)" y1="250" x2="55%" y2="45%"
                            stroke="url(#flow-gradient)"
                            strokeWidth="2"
                            initial={{ pathLength: 0, opacity: 0 }}
                            whileInView={{ pathLength: 1, opacity: 0.8 }}
                            transition={{ duration: 1.5, delay: 1 }}
                        />
                    </svg>

                    {/* LEFT COLUMN - EXPERTISE */}
                    <div className="flex flex-col gap-6 justify-center relative z-10">
                        <GlassPanel intensity="low" className="p-6 border-l-4 border-l-neon-cyan border-y-0 border-r-0 rounded-none bg-gradient-to-r from-neon-cyan/5 to-transparent hover:from-neon-cyan/10 transition-all group">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-mono text-neon-cyan group-hover:text-white transition-colors tracking-widest">{t('cloudNative.label')}</span>
                                <Cloud className="w-5 h-5 text-neon-cyan group-hover:text-white transition-colors" />
                            </div>
                            <div className="text-2xl font-bold text-white mb-2">{t('cloudNative.title')}</div>
                            <div className="text-sm text-slate-400 font-mono leading-relaxed">
                                {t('cloudNative.description')}
                            </div>
                        </GlassPanel>

                        <GlassPanel intensity="low" className="p-6 border-l-4 border-l-neon-pink border-y-0 border-r-0 rounded-none bg-gradient-to-r from-neon-pink/5 to-transparent hover:from-neon-pink/10 transition-all group">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-mono text-neon-pink group-hover:text-white transition-colors tracking-widest">{t('infrastructure.label')}</span>
                                <Server className="w-5 h-5 text-neon-pink animate-pulse" />
                            </div>
                            <div className="text-2xl font-bold text-white mb-2">{t('infrastructure.title')}</div>
                            <div className="text-sm text-slate-400 font-mono leading-relaxed">
                                {t('infrastructure.description')}
                            </div>
                        </GlassPanel>

                        <GlassPanel intensity="low" className="p-6 border-l-4 border-l-purple-500 border-y-0 border-r-0 rounded-none bg-gradient-to-r from-purple-500/5 to-transparent hover:from-purple-500/10 transition-all group">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-mono text-purple-400 group-hover:text-white transition-colors tracking-widest">{t('observability.label')}</span>
                                <Database className="w-5 h-5 text-purple-400" />
                            </div>
                            <div className="text-2xl font-bold text-white mb-2">{t('observability.title')}</div>
                            <div className="text-sm text-slate-400 font-mono leading-relaxed">
                                {t('observability.description')}
                            </div>
                        </GlassPanel>
                    </div>

                    {/* CENTER - EXPANDED 3D HOLOGRAPHIC MAP */}
                    <div className="relative h-[400px] md:h-full [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)] z-10">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-50" />

                        <Canvas camera={{ position: [6, 6, 6], fov: 40 }} className="z-10 relative">
                            <OrbitControls
                                enableZoom={false}
                                autoRotate
                                autoRotateSpeed={0.5}
                                maxPolarAngle={Math.PI / 2}
                                minPolarAngle={Math.PI / 3}
                            />
                            <CityMap />
                            <ambientLight intensity={0.5} />
                            <pointLight position={[10, 10, 10]} color="#00f3ff" intensity={1} />
                        </Canvas>

                        {/* Floating Labels */}
                        <div className="absolute top-8 left-8 bg-black/80 backdrop-blur-md border border-neon-cyan/20 px-4 py-2 text-xs font-mono text-neon-cyan flex items-center gap-3">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan"></span>
                            </span>
                            {t('liveTopology')}
                        </div>

                        <div className="absolute bottom-8 right-8 text-right">
                            <div className="text-xs font-mono text-slate-500 mb-1">{t('uptime')}</div>
                            <div className="text-2xl font-bold text-white font-mono">99.99<span className="text-neon-pink">%</span></div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN - TECH STACK & TOOLS */}
                    <div className="flex flex-col gap-6 justify-center relative z-10">
                        {/* Refactored GlassPanel with consistent style */}
                        <GlassPanel intensity="low" className="p-6 border-r-4 border-r-neon-cyan border-y-0 border-l-0 rounded-none bg-gradient-to-l from-neon-cyan/5 to-transparent hover:from-neon-cyan/10 transition-all group">
                            <div className="flex items-center gap-3 mb-6 text-slate-300 border-b border-white/10 pb-4">
                                <Layers className="w-5 h-5 text-neon-cyan" />
                                <span className="font-mono text-sm font-bold tracking-widest text-white group-hover:text-neon-cyan transition-colors">{t('fullstack.label')}</span>
                            </div>
                            <div className="space-y-4 font-mono text-xs">
                                <div className="flex justify-between items-center p-2 hover:bg-white/5 rounded transition-colors group/item">
                                    <span className="text-slate-400 group-hover/item:text-white">{t('fullstack.frontend')}</span>
                                    <span className="text-neon-cyan">Next.js 15</span>
                                </div>
                                <div className="flex justify-between items-center p-2 hover:bg-white/5 rounded transition-colors group/item">
                                    <span className="text-slate-400 group-hover/item:text-white">{t('fullstack.styling')}</span>
                                    <span className="text-neon-pink">Tailwind v4</span>
                                </div>
                                <div className="flex justify-between items-center p-2 hover:bg-white/5 rounded transition-colors group/item">
                                    <span className="text-slate-400 group-hover/item:text-white">{t('fullstack.visuals')}</span>
                                    <span className="text-white">Three.js R3F</span>
                                </div>
                                <div className="flex justify-between items-center p-2 hover:bg-white/5 rounded transition-colors group/item">
                                    <span className="text-slate-400 group-hover/item:text-white">{t('fullstack.security')}</span>
                                    <span className="text-green-400">OWASP Hardened</span>
                                </div>
                            </div>
                        </GlassPanel>

                        <div className="grid grid-cols-1 gap-4">
                            {/* GIT REPOS CARD */}
                            <a
                                href="https://github.com/avidflyer17"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white/5 border border-white/10 p-4 relative group overflow-hidden transition-all hover:border-neon-cyan/50"
                            >
                                {/* Scanline Effect */}
                                <div className="absolute inset-0 bg-gradient-to-t from-neon-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transform translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out" />

                                {/* Corner Accents */}
                                <div className="absolute top-0 right-0 p-1 opacity-20 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-2 h-2 border-t border-r border-neon-cyan" />
                                </div>
                                <div className="absolute bottom-0 left-0 p-1 opacity-20 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-2 h-2 border-b border-l border-neon-cyan" />
                                </div>

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="text-[10px] font-mono text-slate-500 group-hover:text-neon-cyan transition-colors">{t('sourceCode')}</div>
                                        <ArrowUpRight className="w-3 h-3 text-slate-600 group-hover:text-neon-cyan group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                                    </div>

                                    <div className="text-white font-bold flex items-center gap-3 mb-1">
                                        <Github className="w-5 h-5 text-neon-cyan" />
                                        <span className="tracking-wide">{t('gitRepos')}</span>
                                    </div>

                                    <div className="font-mono text-[10px] text-neon-cyan/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-pulse" />
                                        // {t('activeRepos')}
                                    </div>
                                </div>
                            </a>

                            {/* DATA SELECTION CARD */}
                            <div
                                onClick={() => setIsCVOpen(true)}
                                className="bg-white/5 border border-white/10 p-4 relative group overflow-hidden transition-all hover:border-neon-pink/50 cursor-pointer"
                            >
                                {/* Scanline Effect */}
                                <div className="absolute inset-0 bg-gradient-to-t from-neon-pink/10 to-transparent opacity-0 group-hover:opacity-100 transform translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out" />

                                {/* Corner Accents */}
                                <div className="absolute top-0 right-0 p-1 opacity-20 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-2 h-2 border-t border-r border-neon-pink" />
                                </div>
                                <div className="absolute bottom-0 left-0 p-1 opacity-20 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-2 h-2 border-b border-l border-neon-pink" />
                                </div>

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="text-[10px] font-mono text-slate-500 group-hover:text-neon-pink transition-colors">{t('systemData')}</div>
                                        <ArrowUpRight className="w-3 h-3 text-slate-600 group-hover:text-neon-pink group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                                    </div>

                                    <div className="text-white font-bold flex items-center gap-3 mb-1">
                                        <FileText className="w-5 h-5 text-neon-pink" />
                                        <span className="tracking-wide">{t('dataExtraction')}</span>
                                    </div>

                                    <div className="font-mono text-[10px] text-neon-pink/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                                        <span className="animate-[spin_1s_linear_infinite]">⟳</span>
                                        {t('downloadInitiate')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-12 flex justify-center"
            >
                <CTAButton
                    variant="primary"
                    icon={ChevronRight}
                    onClick={(e) => smoothScrollTo(e, 'contact')}
                    trackingLabel="Custom Architecture"
                    trackingLocation="Architecture"
                >
                    {t('cta.customArch')}
                </CTAButton>
            </motion.div>

            <CVModal isOpen={isCVOpen} onClose={() => setIsCVOpen(false)} />
        </section >
    );
}
