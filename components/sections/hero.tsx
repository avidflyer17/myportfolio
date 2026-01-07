"use client";

import { useTranslations } from 'next-intl';

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, PerspectiveCamera, useTexture } from "@react-three/drei";
import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/glass-panel";

import * as THREE from "three";
import { Cpu, Zap, Terminal, Code2, ArrowRight } from "lucide-react";
import { GlitchText } from "@/components/ui/glitch-text";
import { TypewriterText } from "@/components/ui/typewriter-text";
import { CardTilt } from "@/components/ui/card-tilt";
import { CTAButton } from "@/components/ui/cta-button";
import { smoothScrollTo } from "@/lib/smooth-scroll";

function FloatingLogo() {
    // Load all 6 face textures (optimized WebP format)
    const textures = useTexture([
        "/cube-faces/database.webp",    // Face 0 (right/droite +X)
        "/cube-faces/cloud.webp",       // Face 1 (left/gauche -X)
        "/cube-faces/ai.webp",          // Face 2 (top/haut +Y)
        "/cube-faces/security.webp",    // Face 3 (bottom/bas -Y)
        "/cube-faces/react.webp",       // Face 4 (front/avant +Z)
        "/cube-faces/kubernetes.webp"   // Face 5 (back/arrière -Z)
    ]);

    const meshRef = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        if (meshRef.current) {
            // Simple generic rotation (Spin + slight tilt)
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.4;
            meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
        }
    });

    return (
        <mesh ref={meshRef} scale={0.9}>
            {/* Perfect Cube */}
            <boxGeometry args={[1, 1, 1]} />

            {/* Different material for each face */}
            {textures.map((texture, index) => (
                <meshStandardMaterial
                    key={index}
                    attach={`material-${index}`}
                    map={texture}
                    emissiveMap={texture}
                    emissive="#ffffff"
                    emissiveIntensity={2}
                    color="#ffffff"
                    metalness={0.2}
                    roughness={0.1}
                    toneMapped={false}
                />
            ))}
        </mesh>
    );
}

function ArchitecturalCore() {
    const groupRef = useRef<THREE.Group>(null!);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        // Gentle organic rotation for the surrounding sphere
        groupRef.current.rotation.y = t * 0.1;
        groupRef.current.rotation.z = t * 0.05;
    });

    return (
        <group ref={groupRef}>

            {/* 3D Cube Logo at the Center */}
            <FloatingLogo />

            {/* Core: Distorted Brain/Energy Matter - Reduced opacity to see logo */}
            <Sphere args={[1.3, 64, 64]}>
                <MeshDistortMaterial
                    color="#00f3ff"
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0}
                    metalness={0.9}
                    transmission={0.6} // More glass-like
                    thickness={0.5}
                    transparent
                    opacity={0.2}
                    depthWrite={false}
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

function ResponsiveGroup({ children }: { children: React.ReactNode }) {
    const { viewport } = useThree();
    const isMobile = viewport.width < 5.5; // Adjusted threshold roughly for mobile portrait

    return (
        <group
            scale={isMobile ? 0.4 : 1}
            position={isMobile ? [0, 0.5, 0] : [0, 0, 0]}
        >
            {children}
        </group>
    );
}

import { NeuralInterface } from "@/components/features/neural-interface";
import { FloatingAIOrb } from "@/components/features/floating-ai-orb";
import { useState, useRef, Suspense } from "react";

// ... existing code ...

export function HeroSection() {
    const t = useTranslations('hero');
    const [isNeuralInterfaceOpen, setIsNeuralInterfaceOpen] = useState(false);

    return (
        <section className="relative min-h-screen md:h-screen w-full flex flex-col items-center justify-center overflow-x-hidden md:overflow-hidden bg-transparent py-24 md:py-0">
            <NeuralInterface isOpen={isNeuralInterfaceOpen} onClose={() => setIsNeuralInterfaceOpen(false)} />
            {/* 3D Background */}
            <div className="absolute inset-0 z-0 fixed md:absolute">
                <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 0, 5]} />

                    {/* Atmospheric Lighting - Sufficient for our neon look */}
                    <ambientLight intensity={0.2} />
                    <pointLight position={[10, 10, 5]} intensity={1} color="#ff00ff" />
                    <pointLight position={[-10, -5, -5]} color="#00f3ff" intensity={2} />

                    {/* Architectural Core */}
                    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                        <Suspense fallback={null}>
                            <ResponsiveGroup>
                                <ArchitecturalCore />
                            </ResponsiveGroup>
                        </Suspense>
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
                        <span className="text-xs font-mono text-neon-cyan tracking-[0.2em]">{t('statusBadge')}</span>
                    </motion.div>

                    <motion.div
                        className="text-5xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter filter drop-shadow-[0_0_30px_rgba(0,243,255,0.4)] mix-blend-screen flex flex-col md:block items-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, type: "spring", stiffness: 50 }}
                    >
                        <GlitchText text={t('title.firstName')} className="mr-0 md:mr-8" />
                        <GlitchText
                            text={t('title.lastName')}
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
                            <TypewriterText text={t('subtitle')} delay={0.8} />
                        </span>
                        <span className="text-neon-pink hidden md:inline">/&gt;</span>
                    </motion.div>
                </div>

                {/* 2. DECONSTRUCTED DASHBOARD (Split Floating Widgets) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl mx-auto pointer-events-auto">

                    {/* LEFT WIDGET: ACTION CENTER */}
                    <CardTilt className="w-full h-full">
                        <motion.div
                            whileHover={{
                                y: -4,
                                boxShadow: '0 0 30px rgba(0,243,255,0.3), 0 20px 40px rgba(0,0,0,0.3)'
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            <GlassPanel
                                intensity="low"
                                className="bg-black/80 backdrop-blur-xl border border-white/10 hover:border-neon-cyan/50 transition-all duration-500 p-8 group h-full relative overflow-hidden"
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                {/* Subtle scan line effect */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                                    animate={{ y: ['0%', '100%'] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                />

                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-sm font-mono text-neon-cyan flex items-center gap-2">
                                            <Code2 className="w-4 h-4" />
                                            {t('missionProfile.title')}
                                        </h3>
                                        <div className="flex items-center gap-2 px-2 py-1 rounded bg-green-500/10 border border-green-500/20">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
                                            <span className="text-[10px] font-mono text-green-500 tracking-wider">{t('missionProfile.status')}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-white text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: t.raw('missionProfile.description').replace(/<highlight>/g, '<span class="text-neon-cyan font-semibold">').replace(/<\/highlight>/g, '</span>') }} />
                                        <div className="relative">
                                            <p className="text-slate-300 text-sm font-mono border-l-2 border-neon-cyan/40 pl-3 italic bg-neon-cyan/5 py-2 rounded-r">
                                                {t('missionProfile.quote')}
                                                <motion.span
                                                    className="inline-block ml-1 text-neon-cyan"
                                                    animate={{ opacity: [1, 0, 1] }}
                                                    transition={{ duration: 1, repeat: Infinity }}
                                                >
                                                    ▊
                                                </motion.span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 mt-10">
                                    <CTAButton
                                        variant="primary"
                                        icon={ArrowRight}
                                        onClick={(e) => smoothScrollTo(e, 'contact')}
                                        pulse
                                        className="flex-1"
                                        trackingLabel="Start Project"
                                        trackingLocation="Hero"
                                    >
                                        {t('cta.startProject')}
                                    </CTAButton>

                                    <CTAButton
                                        variant="secondary"
                                        icon={Terminal}
                                        onClick={(e) => smoothScrollTo(e, 'projects')}
                                        className="flex-1"
                                        trackingLabel="View Portfolio"
                                        trackingLocation="Hero"
                                    >
                                        {t('cta.viewPortfolio')}
                                    </CTAButton>
                                </div>

                                {/* Corner Accents */}
                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30" />
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30" />
                            </GlassPanel>
                        </motion.div>
                    </CardTilt>

                    {/* RIGHT WIDGET: SYSTEM STATUS */}
                    <CardTilt className="w-full h-full">
                        <motion.div
                            whileHover={{
                                y: -4,
                                boxShadow: '0 0 30px rgba(255,0,255,0.3), 0 20px 40px rgba(0,0,0,0.3)'
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            <GlassPanel
                                intensity="low"
                                className="bg-black/80 backdrop-blur-xl border border-white/10 hover:border-neon-pink/50 transition-all duration-500 p-8 flex flex-col justify-between gap-6 h-full relative overflow-hidden"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 }}
                            >
                                {/* Subtle scan line effect */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-pink/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                                    animate={{ y: ['0%', '100%'] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                />

                                <h3 className="text-sm font-mono text-neon-pink mb-4 flex items-center gap-2">
                                    <Terminal className="w-4 h-4" />
                                    {t('systemMetrics.title')}
                                </h3>

                                <div className="space-y-3 font-mono text-xs">
                                    <div className="flex items-center justify-between text-slate-300 hover:text-white transition-colors">
                                        <span className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-neon-cyan rounded-full shadow-[0_0_6px_#00f3ff]" />
                                            {t('systemMetrics.nextjs')}
                                        </span>
                                        <span className="text-neon-cyan">{t('systemMetrics.loaded')}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-slate-300 hover:text-white transition-colors">
                                        <span className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-neon-cyan rounded-full shadow-[0_0_6px_#00f3ff]" />
                                            {t('systemMetrics.react')}
                                        </span>
                                        <span className="text-neon-cyan">{t('systemMetrics.loaded')}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-slate-300">
                                        <span className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-neon-pink rounded-full animate-pulse shadow-[0_0_8px_#ff00ff]" />
                                            {t('systemMetrics.ai')}
                                        </span>
                                        <span className="text-neon-pink">{t('systemMetrics.gemini')}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-slate-300 hover:text-white transition-colors">
                                        <span className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_6px_#3b82f6]" />
                                            {t('systemMetrics.typescript')}
                                        </span>
                                        <span className="text-blue-500">{t('systemMetrics.strict')}</span>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-slate-400">
                                        <span>{t('systemMetrics.availability')}</span>
                                        <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-[10px] border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.3)]">{t('systemMetrics.openForWork')}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <div className="bg-white/5 border border-white/10 p-3 rounded flex items-center gap-3 hover:bg-white/10 hover:border-green-500/30 transition-all">
                                        <div className="relative">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping absolute inset-0" />
                                            <div className="w-2 h-2 bg-green-500 rounded-full relative shadow-[0_0_10px_#22c55e]" />
                                        </div>
                                        <div className="text-xs font-mono text-slate-300">{t('systemMetrics.experience')}</div>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 p-3 rounded flex items-center gap-3 hover:bg-white/10 hover:border-cyan-400/30 transition-all">
                                        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <div className="text-xs font-mono text-slate-300">{t('systemMetrics.location')}</div>
                                    </div>
                                </div>

                                {/* Corner Accents */}
                                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/30" />
                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/30" />
                            </GlassPanel>
                        </motion.div>
                    </CardTilt>
                </div>
            </div>

            {/* Floating AI Assistant */}
            <FloatingAIOrb onClick={() => setIsNeuralInterfaceOpen(prev => !prev)} />

            {/* Bottom Fade Transition */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black via-black/80 to-transparent z-20 pointer-events-none" />
        </section>
    );
}
