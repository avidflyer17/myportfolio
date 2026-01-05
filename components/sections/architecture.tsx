"use client";

import { GlassPanel } from "@/components/ui/glass-panel";
import { motion } from "framer-motion";
import { Server, Database, Shield, Cpu, Cloud, Terminal, Layers, Hash } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { CityMap } from "@/components/canvas/city-map";
import { OrbitControls } from "@react-three/drei";

export function ArchitectureSection() {
    return (
        <section id="architecture" className="py-24 relative overflow-hidden bg-black w-full min-h-screen flex flex-col justify-center">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neon-cyan/5 via-transparent to-transparent opacity-50" />

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
                        CORE_ARCHITECTURE
                    </motion.h2>
                    <div className="flex items-center gap-4 mt-6">
                        <div className="h-px w-24 bg-gradient-to-r from-transparent to-neon-pink/50" />
                        <div className="text-neon-pink font-mono text-sm tracking-[0.3em] font-bold uppercase">
                            Scalable Experience Design
                        </div>
                        <div className="h-px w-24 bg-gradient-to-l from-transparent to-neon-pink/50" />
                    </div>
                </div>

                {/* Main Widescreen Layout */}
                <div className="relative h-[800px] md:h-[700px] w-full max-w-[95%] mx-auto grid grid-cols-1 md:grid-cols-[350px_1fr_350px] gap-8">

                    {/* LEFT COLUMN - EXPERTISE */}
                    <div className="flex flex-col gap-6 justify-center">
                        <GlassPanel intensity="low" className="p-6 border-l-4 border-l-neon-cyan border-y-0 border-r-0 rounded-none bg-gradient-to-r from-neon-cyan/5 to-transparent hover:from-neon-cyan/10 transition-all group">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-mono text-neon-cyan group-hover:text-white transition-colors tracking-widest">CLOUD_NATIVE</span>
                                <Cloud className="w-5 h-5 text-neon-cyan group-hover:text-white transition-colors" />
                            </div>
                            <div className="text-2xl font-bold text-white mb-2">Docker & K8s</div>
                            <div className="text-sm text-slate-400 font-mono leading-relaxed">
                                Advanced container orchestration and microservices architecture.
                            </div>
                        </GlassPanel>

                        <GlassPanel intensity="low" className="p-6 border-l-4 border-l-neon-pink border-y-0 border-r-0 rounded-none bg-gradient-to-r from-neon-pink/5 to-transparent hover:from-neon-pink/10 transition-all group">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-mono text-neon-pink group-hover:text-white transition-colors tracking-widest">INFRASTRUCTURE</span>
                                <Server className="w-5 h-5 text-neon-pink animate-pulse" />
                            </div>
                            <div className="text-2xl font-bold text-white mb-2">Ansible & Linux</div>
                            <div className="text-sm text-slate-400 font-mono leading-relaxed">
                                Automated provisioning and system hardening for mission-critical environments.
                            </div>
                        </GlassPanel>

                        <GlassPanel intensity="low" className="p-6 border-l-4 border-l-purple-500 border-y-0 border-r-0 rounded-none bg-gradient-to-r from-purple-500/5 to-transparent hover:from-purple-500/10 transition-all group">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-mono text-purple-400 group-hover:text-white transition-colors tracking-widest">OBSERVABILITY</span>
                                <Database className="w-5 h-5 text-purple-400" />
                            </div>
                            <div className="text-2xl font-bold text-white mb-2">Grafana Stack</div>
                            <div className="text-sm text-slate-400 font-mono leading-relaxed">
                                Full-stack monitoring with Prometheus, Loki, and Promtail.
                            </div>
                        </GlassPanel>
                    </div>

                    {/* CENTER - EXPANDED 3D HOLOGRAPHIC MAP */}
                    <div className="relative h-[400px] md:h-full [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]">
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
                            LIVE_TOPOLOGY_VIEW
                        </div>

                        <div className="absolute bottom-8 right-8 text-right">
                            <div className="text-xs font-mono text-slate-500 mb-1">UPTIME</div>
                            <div className="text-2xl font-bold text-white font-mono">99.99<span className="text-neon-pink">%</span></div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN - TECH STACK & TOOLS */}
                    <div className="flex flex-col gap-6 justify-center">
                        <GlassPanel intensity="high" className="h-fit border-r-4 border-r-white/10 border-y-0 border-l-0 rounded-none bg-gradient-to-l from-white/5 to-transparent p-6">
                            <div className="flex items-center gap-3 mb-6 text-slate-300 border-b border-white/10 pb-4">
                                <Layers className="w-5 h-5 text-neon-cyan" />
                                <span className="font-mono text-sm font-bold tracking-widest">FULLSTACK_OVERVIEW</span>
                            </div>
                            <div className="space-y-4 font-mono text-xs">
                                <div className="flex justify-between items-center p-2 hover:bg-white/5 rounded transition-colors group">
                                    <span className="text-slate-400 group-hover:text-white">Frontend</span>
                                    <span className="text-neon-cyan">Next.js 15</span>
                                </div>
                                <div className="flex justify-between items-center p-2 hover:bg-white/5 rounded transition-colors group">
                                    <span className="text-slate-400 group-hover:text-white">Styling</span>
                                    <span className="text-neon-pink">Tailwind v4</span>
                                </div>
                                <div className="flex justify-between items-center p-2 hover:bg-white/5 rounded transition-colors group">
                                    <span className="text-slate-400 group-hover:text-white">Visuals</span>
                                    <span className="text-white">Three.js R3F</span>
                                </div>
                                <div className="flex justify-between items-center p-2 hover:bg-white/5 rounded transition-colors group">
                                    <span className="text-slate-400 group-hover:text-white">Security</span>
                                    <span className="text-green-400">OWASP Hardened</span>
                                </div>
                            </div>
                        </GlassPanel>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="bg-white/5 border border-white/10 p-4 relative group hover:border-neon-cyan/50 transition-colors">
                                <div className="absolute top-0 right-0 p-1 opacity-20 group-hover:opacity-100 transition-opacity">
                                    <Hash className="w-4 h-4 text-neon-cyan" />
                                </div>
                                <div className="text-xs font-mono text-slate-500 mb-1">CURRENT_PROJECTS</div>
                                <div className="text-white font-bold flex items-center gap-2">
                                    <Terminal className="w-4 h-4 text-neon-cyan" />
                                    <span>GIT_REPOS</span>
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-4 relative group hover:border-neon-pink/50 transition-colors">
                                <div className="absolute top-0 right-0 p-1 opacity-20 group-hover:opacity-100 transition-opacity">
                                    <Shield className="w-4 h-4 text-neon-pink" />
                                </div>
                                <div className="text-xs font-mono text-slate-500 mb-1">VERIFICATION</div>
                                <div className="text-white font-bold flex items-center gap-2">
                                    <Cpu className="w-4 h-4 text-neon-pink" />
                                    <span>CERTIFICATIONS</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
