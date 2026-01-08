"use client";

import { useTranslations } from 'next-intl';
import { useRef, Suspense, useState } from "react";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, PerspectiveCamera, useTexture, PerformanceMonitor } from "@react-three/drei";
import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/glass-panel";

import * as THREE from "three";
import { Terminal, Code2, ArrowRight } from "lucide-react";
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
                <meshBasicMaterial color="#ff00ff" wireframe transparent opacity={0.2} />
            </mesh>

            <mesh scale={2.2} rotation-y={-Math.PI / 4}>
                <icosahedronGeometry args={[1, 1]} />
                <meshBasicMaterial color="#00f3ff" wireframe transparent opacity={0.2} />
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
            scale={isMobile ? 0.35 : 1}
            position={isMobile ? [0, 1.5, -2] : [0, 0, 0]}
        >
            {children}
        </group>
    );
}



export function HeroSection() {
    const t = useTranslations('hero');
    const [dpr, setDpr] = useState(1.5); // Default to reasonable quality

    return (
        <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-x-hidden md:overflow-hidden bg-transparent py-24 md:py-16 lg:py-24">

            {/* 3D Background */}
            <div className="absolute inset-0 z-0 fixed md:absolute">
                <Canvas
                    dpr={dpr}
                    gl={{
                        powerPreference: "high-performance",
                        antialias: true,
                        stencil: false,
                        depth: true
                    }}
                    camera={{ position: [0, 0, 5], fov: 75 }}
                >
                    <PerformanceMonitor onIncline={() => setDpr(2)} onDecline={() => setDpr(1)} >
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
                    </PerformanceMonitor>
                </Canvas>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 container mx-auto px-4 pointer-events-none w-full flex flex-col justify-center gap-12 md:gap-16 lg:gap-20">

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
                    <CardTilt className="w-full">
                        <motion.div
                            whileHover={{
                                y: -4,
                                boxShadow: '0 0 30px rgba(0,243,255,0.3), 0 20px 40px rgba(0,0,0,0.3)'
                            }}
                            transition={{ duration: 0.3 }}
                            className="h-full"
                        >
                            <GlassPanel
                                intensity="low"
                                className="bg-black/80 backdrop-blur-xl border border-white/10 hover:border-neon-cyan/50 transition-all duration-500 p-6 md:p-8 group min-h-full relative overflow-hidden flex flex-col"
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

                                <div className="flex-1">
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

                                <div className="flex flex-col sm:flex-row gap-4 mt-8">
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
                    <CardTilt className="w-full">
                        <motion.div
                            whileHover={{
                                y: -4,
                                boxShadow: '0 0 30px rgba(255,0,255,0.3), 0 20px 40px rgba(0,0,0,0.3)'
                            }}
                            transition={{ duration: 0.3 }}
                            className="h-full"
                        >
                            <GlassPanel
                                intensity="low"
                                className="bg-black/80 backdrop-blur-xl border border-white/10 hover:border-neon-pink/50 transition-all duration-500 p-6 md:p-8 flex flex-col gap-4 min-h-full relative overflow-hidden"
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

                                {/* Tech Stack - Visual Badges */}
                                <div className="space-y-4">
                                    <div className="flex flex-wrap gap-2">
                                        {/* Next.js */}
                                        <div className="group relative bg-gradient-to-r from-slate-900 to-black border border-white/20 hover:border-white/40 px-3 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105">
                                            <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_8px_#fff]" />
                                            <span className="text-xs font-mono text-white">Next.js</span>
                                        </div>

                                        {/* React */}
                                        <div className="group relative bg-gradient-to-r from-cyan-950 to-cyan-900/50 border border-cyan-500/30 hover:border-cyan-500/60 px-3 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105">
                                            <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]" />
                                            <span className="text-xs font-mono text-cyan-300">React</span>
                                        </div>

                                        {/* TypeScript */}
                                        <div className="group relative bg-gradient-to-r from-blue-950 to-blue-900/50 border border-blue-500/30 hover:border-blue-500/60 px-3 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_8px_#3b82f6]" />
                                            <span className="text-xs font-mono text-blue-300">TypeScript</span>
                                        </div>

                                        {/* Tailwind */}
                                        <div className="group relative bg-gradient-to-r from-sky-950 to-sky-900/50 border border-sky-500/30 hover:border-sky-500/60 px-3 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105">
                                            <div className="w-2 h-2 bg-sky-400 rounded-full shadow-[0_0_8px_#0ea5e9]" />
                                            <span className="text-xs font-mono text-sky-300">Tailwind</span>
                                        </div>

                                        {/* Three.js */}
                                        <div className="group relative bg-gradient-to-r from-emerald-950 to-emerald-900/50 border border-emerald-500/30 hover:border-emerald-500/60 px-3 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105">
                                            <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_#10b981]" />
                                            <span className="text-xs font-mono text-emerald-300">Three.js</span>
                                        </div>

                                        {/* Docker */}
                                        <div className="group relative bg-gradient-to-r from-blue-950 to-blue-800/50 border border-blue-400/30 hover:border-blue-400/60 px-3 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_8px_#60a5fa]" />
                                            <span className="text-xs font-mono text-blue-300">Docker</span>
                                        </div>

                                        {/* PostgreSQL */}
                                        <div className="group relative bg-gradient-to-r from-indigo-950 to-indigo-900/50 border border-indigo-500/30 hover:border-indigo-500/60 px-3 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105">
                                            <div className="w-2 h-2 bg-indigo-400 rounded-full shadow-[0_0_8px_#6366f1]" />
                                            <span className="text-xs font-mono text-indigo-300">PostgreSQL</span>
                                        </div>

                                        {/* AI - Gemini */}
                                        <div className="group relative bg-gradient-to-r from-pink-950 to-purple-900/50 border border-neon-pink/40 hover:border-neon-pink/70 px-3 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105">
                                            <div className="w-2 h-2 bg-neon-pink rounded-full animate-pulse shadow-[0_0_10px_#ff00ff]" />
                                            <span className="text-xs font-mono text-neon-pink">Gemini AI</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Performance Metrics */}
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <div className="text-[10px] font-mono text-neon-pink mb-3 tracking-wider">{t('systemMetrics.performance')}</div>
                                    <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                                        <div className="bg-green-500/10 border border-green-500/30 px-3 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-green-500/20 transition-all">
                                            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-green-400 text-[11px] font-semibold">{t('systemMetrics.uptime')}</span>
                                        </div>
                                        <div className="bg-cyan-500/10 border border-cyan-500/30 px-3 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-cyan-500/20 transition-all">
                                            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            <span className="text-cyan-400 text-[11px] font-semibold">{t('systemMetrics.responseTime')}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Availability Status */}
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="text-[10px] font-mono text-neon-pink tracking-wider">{t('systemMetrics.availability')}</div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30 hover:bg-green-500/20 transition-all">
                                            <div className="relative">
                                                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping absolute inset-0" />
                                                <div className="w-2 h-2 bg-green-500 rounded-full relative shadow-[0_0_10px_#22c55e]" />
                                            </div>
                                            <span className="text-[10px] font-mono text-green-400 tracking-wider font-semibold">{t('systemMetrics.openForWork')}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-gradient-to-r from-green-950 to-green-900/50 border border-green-500/30 hover:border-green-500/60 px-3 py-2.5 rounded-lg flex items-center gap-2 transition-all hover:scale-105">
                                            <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_#22c55e]" />
                                            <div className="text-xs font-mono text-green-300">{t('systemMetrics.experience')}</div>
                                        </div>
                                        <div className="bg-gradient-to-r from-cyan-950 to-cyan-900/50 border border-cyan-500/30 hover:border-cyan-500/60 px-3 py-2.5 rounded-lg flex items-center gap-2 transition-all hover:scale-105">
                                            <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <div className="text-xs font-mono text-cyan-300">{t('systemMetrics.location')}</div>
                                        </div>
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



            {/* Bottom Fade Transition */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black via-black/80 to-transparent z-20 pointer-events-none" />
        </section>
    );
}
