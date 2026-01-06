"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, PerspectiveCamera } from "@react-three/drei";
import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/glass-panel";
import { CyberLogo } from "@/components/ui/cyber-logo";
import { useRef } from "react";
import * as THREE from "three";
import { Cpu, Zap, Terminal, Code2 } from "lucide-react";
import { GlitchText } from "@/components/ui/glitch-text";
import { TypewriterText } from "@/components/ui/typewriter-text";
import { CardTilt } from "@/components/ui/card-tilt";

function ArchitecturalCore() {
    const groupRef = useRef<THREE.Group>(null!);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        // Gentle organic rotation
        groupRef.current.rotation.y = t * 0.1;
        groupRef.current.rotation.z = t * 0.05;
    });

    return (
        <group ref={groupRef}>


            {/* Core: Distorted Brain/Energy Matter */}
            <Sphere args={[1, 64, 64]}>
                <MeshDistortMaterial
                    color="#00f3ff"
                    attach="material"
                    distort={0.6}
                    speed={3}
                    roughness={0.2}
                    metalness={0.8}
                    emissive="#000020" // Darker emissive for depth
                />
            </Sphere>

            {/* Neural Web: Connecting lines (Wireframe Sphere) */}
            <mesh scale={2.8} rotation-x={Math.PI / 4}>
                <icosahedronGeometry args={[1, 2]} />
                <meshBasicMaterial color="#ff00ff" wireframe transparent opacity={0.05} />
            </mesh>

            <mesh scale={2.2} rotation-y={-Math.PI / 4}>
                <icosahedronGeometry args={[1, 1]} />
                <meshBasicMaterial color="#00f3ff" wireframe transparent opacity={0.05} />
            </mesh>
        </group>
    );
}

function MovingGrid() {
    const gridRef = useRef<THREE.Group>(null!);
    useFrame((state) => {
        gridRef.current.position.z = (state.clock.getElapsedTime() * 0.5) % 2;
    });
    return (
        <group ref={gridRef} position={[0, -2, 0]}>
            <gridHelper args={[20, 20, 0xff00ff, 0x1a1a1a]} />
            <gridHelper args={[20, 4, 0x00f3ff, 0x000000]} position={[0, 0.1, 0]} />
        </group>
    )
}

export function HeroSection() {
    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-transparent">
            {/* 3D Background */}
            <div className="absolute inset-0 z-0">
                <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 0, 5]} />

                    {/* Atmospheric Lighting */}
                    <ambientLight intensity={0.2} />
                    <pointLight position={[10, 10, 5]} intensity={1} color="#ff00ff" />
                    <pointLight position={[-10, -5, -5]} color="#00f3ff" intensity={2} />

                    {/* Architectural Core */}
                    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                        <ArchitecturalCore />
                    </Float>

                    {/* Cyber Grid Floor (Visual Depth) */}
                    <MovingGrid />

                    {/* Environmental Fog */}
                    <fog attach="fog" args={['#000', 5, 20]} />
                </Canvas>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 container mx-auto px-4 pointer-events-none h-full flex flex-col justify-center gap-16 md:gap-24">

                {/* 1. FLOATING TITLE (No Box) */}
                <div className="flex flex-col items-center text-center pointer-events-auto">

                    <CyberLogo />

                    <motion.div
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 border border-neon-cyan/30 backdrop-blur-md mb-6"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" />
                        <span className="text-xs font-mono text-neon-cyan tracking-[0.2em]">NEURAL_LINK_ESTABLISHED</span>
                    </motion.div>

                    <motion.div
                        className="text-5xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter filter drop-shadow-[0_0_30px_rgba(0,243,255,0.4)] mix-blend-screen flex flex-col md:block items-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, type: "spring", stiffness: 50 }}
                    >
                        <GlitchText text="DAMIEN" className="mr-0 md:mr-8" />
                        <GlitchText
                            text="SCHONBAKLER"
                            textClassName="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-white"
                        />
                    </motion.div>

                    <motion.div
                        className="flex items-center gap-4 mt-6 text-xl md:text-3xl font-mono text-slate-300 font-bold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <span className="text-neon-pink hidden md:inline">&lt;</span>
                        <span className="tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            <TypewriterText text="Architecte Solutions" delay={0.8} />
                        </span>
                        <span className="text-neon-pink hidden md:inline">/&gt;</span>
                    </motion.div>
                </div>

                {/* 2. DECONSTRUCTED DASHBOARD (Split Floating Widgets) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl mx-auto pointer-events-auto">

                    {/* LEFT WIDGET: ACTION CENTER */}
                    <CardTilt className="w-full h-full">
                        <GlassPanel
                            intensity="low"
                            className="bg-black/40 backdrop-blur-xl border border-white/10 hover:border-neon-cyan/50 transition-colors duration-500 p-8 flex flex-col justify-between gap-6 group h-full"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-sm font-mono text-neon-cyan flex items-center gap-2">
                                        <Code2 className="w-4 h-4" />
                                        MISSION_PROFILE
                                    </h3>
                                    <div className="flex items-center gap-2 px-2 py-1 rounded bg-green-500/10 border border-green-500/20">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[10px] font-mono text-green-500 tracking-wider">OPERATIONAL</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-slate-400 text-sm font-mono border-l-2 border-neon-cyan/30 pl-3 italic">
                                        &quot;Je ne me contente pas d&apos;écrire du code, je conçois des systèmes.&quot;
                                    </p>
                                    <p className="text-slate-300 text-lg leading-relaxed font-light">
                                        Conception d&apos;architectures <span className="text-white font-medium">distribuées</span> et d&apos;interfaces <span className="text-white font-medium">immersives</span> pour le web de demain.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    aria-label="Initialiser la navigation vers l'architecture"
                                    onClick={() => document.getElementById('architecture')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="flex-1 py-4 bg-neon-cyan text-black font-bold tracking-widest uppercase rounded hover:bg-white transition-colors flex items-center justify-center gap-2 group/btn"
                                >
                                    <Zap className="w-4 h-4" />
                                    Initialize
                                </button>
                                <button
                                    aria-label="Voir l'historique de carrière"
                                    onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="flex-1 py-4 bg-white/5 border border-white/10 text-white hover:border-neon-pink hover:text-neon-pink transition-all font-bold tracking-widest uppercase rounded backdrop-blur-md"
                                >
                                    Logs
                                </button>
                            </div>

                            {/* Corner Accents */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30" />
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30" />
                        </GlassPanel>
                    </CardTilt>

                    {/* RIGHT WIDGET: SYSTEM STATUS */}
                    <CardTilt className="w-full h-full hidden md:block">
                        <GlassPanel
                            intensity="low"
                            className="bg-black/40 backdrop-blur-xl border border-white/10 hover:border-neon-pink/50 transition-colors duration-500 p-8 flex flex-col justify-between gap-6 h-full"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            <h3 className="text-sm font-mono text-neon-pink mb-4 flex items-center gap-2">
                                <Terminal className="w-4 h-4" />
                                SYSTEM_METRICS
                            </h3>

                            <div className="space-y-3 font-mono text-xs">
                                <div className="flex items-center justify-between text-slate-400">
                                    <span className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-neon-cyan rounded-full" />
                                        NEXT.JS_KERNEL
                                    </span>
                                    <span className="text-neon-cyan">[LOADED]</span>
                                </div>
                                <div className="flex items-center justify-between text-slate-400">
                                    <span className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-neon-cyan rounded-full" />
                                        REACT_CORE
                                    </span>
                                    <span className="text-neon-cyan">[LOADED]</span>
                                </div>
                                <div className="flex items-center justify-between text-slate-400">
                                    <span className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-neon-pink rounded-full animate-pulse" />
                                        AI_MODULES
                                    </span>
                                    <span className="text-neon-pink">[SYNCING...]</span>
                                </div>
                                <div className="flex items-center justify-between text-slate-400">
                                    <span className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                        TYPESCRIPT
                                    </span>
                                    <span className="text-blue-500">[STRICT]</span>
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-slate-500">
                                    <span>AVAILABILITY</span>
                                    <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-[10px] border border-green-500/30">OPEN_FOR_WORK</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div className="bg-white/5 p-3 rounded flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-ping absolute inset-0" />
                                        <div className="w-2 h-2 bg-green-500 rounded-full relative" />
                                    </div>
                                    <div className="text-xs font-mono text-slate-300">ONLINE</div>
                                </div>
                                <div className="bg-white/5 p-3 rounded flex items-center gap-3">
                                    <Cpu className="w-4 h-4 text-purple-400" />
                                    <div className="text-xs font-mono text-slate-300">v2.0.4</div>
                                </div>
                            </div>

                            {/* Corner Accents */}
                            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/30" />
                            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/30" />
                        </GlassPanel>
                    </CardTilt>
                </div>
            </div>
            {/* Bottom Fade Transition */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black via-black/80 to-transparent z-20 pointer-events-none" />
        </section>
    );
}
