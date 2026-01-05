"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Stars, Sparkles, TorusKnot, PerspectiveCamera } from "@react-three/drei";
import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/glass-panel";
import { useRef } from "react";
import * as THREE from "three";
import { Cpu, Zap, Terminal, Code2 } from "lucide-react";

function ArchitecturalCore() {
    const meshRef = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        meshRef.current.rotation.x = t * 0.2;
        meshRef.current.rotation.y = t * 0.1;
    });

    return (
        <group>
            {/* Inner Core */}
            <TorusKnot args={[1, 0.3, 128, 16]} ref={meshRef}>
                <MeshDistortMaterial
                    color="#00f3ff"
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                    emissive="#000000"
                />
            </TorusKnot>

            {/* Outer Wireframe Shell */}
            <mesh scale={2.5}>
                <icosahedronGeometry args={[1, 2]} />
                <meshBasicMaterial color="#ff00ff" wireframe transparent opacity={0.05} />
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
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
            {/* 3D Background */}
            <div className="absolute inset-0 z-0">
                <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                    <color attach="background" args={['#050505']} />

                    {/* Atmospheric Lighting */}
                    <ambientLight intensity={0.2} />
                    <pointLight position={[10, 10, 5]} intensity={1} color="#ff00ff" />
                    <pointLight position={[-10, -5, -5]} color="#00f3ff" intensity={2} />

                    {/* Space Debris / Data Particles */}
                    <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
                    <Sparkles count={200} scale={10} size={2} speed={0.4} opacity={0.5} color="#00f3ff" />

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
                    <motion.div
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 border border-neon-cyan/30 backdrop-blur-md mb-6"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" />
                        <span className="text-xs font-mono text-neon-cyan tracking-[0.2em]">NEURAL_LINK_ESTABLISHED</span>
                    </motion.div>

                    <motion.h1
                        className="text-5xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter filter drop-shadow-[0_0_30px_rgba(0,243,255,0.4)] mix-blend-screen"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, type: "spring", stiffness: 50 }}
                    >
                        DAMIEN <br className="md:hidden" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-white">SCHONBAKLER</span>
                    </motion.h1>

                    <motion.div
                        className="flex items-center gap-4 mt-6 text-xl md:text-3xl font-mono text-slate-300 font-bold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <span className="text-neon-pink hidden md:inline">&lt;</span>
                        <span className="tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Architecte Solutions</span>
                        <span className="text-neon-pink hidden md:inline">/&gt;</span>
                    </motion.div>
                </div>

                {/* 2. DECONSTRUCTED DASHBOARD (Split Floating Widgets) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl mx-auto pointer-events-auto">

                    {/* LEFT WIDGET: ACTION CENTER */}
                    <GlassPanel
                        intensity="low"
                        className="bg-black/40 backdrop-blur-xl border border-white/10 hover:border-neon-cyan/50 transition-colors duration-500 p-8 flex flex-col justify-between gap-6 group"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <div>
                            <h3 className="text-sm font-mono text-neon-cyan mb-4 flex items-center gap-2">
                                <Code2 className="w-4 h-4" />
                                MISSION_PROFILE
                            </h3>
                            <p className="text-slate-300 text-lg leading-relaxed font-light">
                                Conception d&apos;architectures <span className="text-white font-medium">distribuées</span> et d&apos;interfaces <span className="text-white font-medium">immersives</span> pour le web de demain.
                            </p>
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

                    {/* RIGHT WIDGET: SYSTEM STATUS */}
                    <GlassPanel
                        intensity="low"
                        className="bg-black/40 backdrop-blur-xl border border-white/10 hover:border-neon-pink/50 transition-colors duration-500 p-8 hidden md:flex flex-col justify-between gap-6"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <h3 className="text-sm font-mono text-neon-pink mb-4 flex items-center gap-2">
                            <Terminal className="w-4 h-4" />
                            SYSTEM_METRICS
                        </h3>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-mono text-slate-400">
                                    <span>FULLSTACK_MASTERY</span>
                                    <span className="text-neon-cyan">98%</span>
                                </div>
                                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-neon-cyan to-blue-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: "98%" }}
                                        transition={{ delay: 1.2, duration: 1.5 }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-mono text-slate-400">
                                    <span>CLOUD_INFRASTRUCTURE</span>
                                    <span className="text-neon-pink">95%</span>
                                </div>
                                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-neon-pink to-purple-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: "95%" }}
                                        transition={{ delay: 1.4, duration: 1.5 }}
                                    />
                                </div>
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

                </div>
            </div>
        </section>
    );
}
