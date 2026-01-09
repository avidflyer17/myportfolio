"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { motion, AnimatePresence } from "framer-motion";
import { useNeuralInterface } from "@/components/features/neural-interface";
import { useTranslations } from 'next-intl';
import * as THREE from 'three';


function CyberOrb({ isHovered, onClick }: { isHovered: boolean; onClick: () => void }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const nodesRef = useRef<THREE.Points>(null);
    const wireRef = useRef<THREE.Mesh>(null);
    const outerRef = useRef<THREE.Mesh>(null);
    const groupRef = useRef<THREE.Group>(null);

    // Spring-like scale animation
    const springScale = useRef(1.1);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        // Target scale based on hover
        const targetScale = isHovered ? 1.4 : 1.1;
        // Smooth interpolation (lerp)
        springScale.current += (targetScale - springScale.current) * 0.1;

        if (groupRef.current) {
            groupRef.current.scale.setScalar(springScale.current);
        }

        if (meshRef.current) meshRef.current.rotation.y = t * 0.2;
        if (nodesRef.current) {
            nodesRef.current.rotation.y = t * 0.4;
            nodesRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.04);
        }
        if (wireRef.current) {
            wireRef.current.rotation.y = t * 0.4;
            wireRef.current.rotation.x = t * 0.1;
        }
        if (outerRef.current) {
            outerRef.current.rotation.y = -t * 0.2;
        }
    });

    const themeColor = isHovered ? "#00f3ff" : "#ff00ff";

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <group ref={groupRef} onClick={onClick}>
                {/* 1. Synaptic Nodes */}
                <points ref={nodesRef}>
                    <icosahedronGeometry args={[1, 3]} />
                    <pointsMaterial
                        color={themeColor}
                        size={0.035}
                        transparent
                        opacity={0.9}
                        sizeAttenuation
                        blending={THREE.AdditiveBlending}
                    />
                </points>

                {/* 2. Primary Neural Shell */}
                <mesh ref={wireRef}>
                    <icosahedronGeometry args={[1, 3]} />
                    <meshBasicMaterial
                        color={themeColor}
                        wireframe
                        transparent
                        opacity={0.3}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>

                {/* 3. Outer Aura Shell (Slow) */}
                <mesh ref={outerRef} scale={1.2}>
                    <icosahedronGeometry args={[1, 1]} />
                    <meshBasicMaterial
                        color={themeColor}
                        wireframe
                        transparent
                        opacity={0.1}
                    />
                </mesh>

                {/* 4. Core Singularity */}
                <mesh ref={meshRef}>
                    <sphereGeometry args={[0.25, 32, 32]} />
                    <meshStandardMaterial
                        color={themeColor}
                        emissive={themeColor}
                        emissiveIntensity={1.5}
                        metalness={1}
                        roughness={0}
                        toneMapped={false}
                    />
                </mesh>
            </group>
        </Float>
    );
}

export function FloatingAIOrb() {
    const [isHovered, setIsHovered] = useState(false);
    const { isOpen, open } = useNeuralInterface();
    const t = useTranslations('neuralInterface');

    // Reset hover state when the chat opens/closes to prevent it being stuck in a highlight state
    // Derived state to force un-hover when chat is open
    const effectiveIsHovered = isOpen ? false : isHovered;

    return (
        <>
            {/* MOBILE: 2D High-Contrast Button */}
            <div className={`pt-safe fixed bottom-4 right-4 z-50 md:hidden transition-all duration-300 ${isOpen ? 'opacity-0 translate-y-10 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
                <button
                    onClick={() => {
                        setIsHovered(false);
                        open();
                    }}
                    className="relative group flex items-center justify-center w-14 h-14 bg-black/90 border border-neon-cyan rounded-full shadow-[0_0_15px_rgba(0,243,255,0.3)] overflow-hidden active:scale-95 transition-transform"
                >
                    {/* Pulsing Background */}
                    <div className="absolute inset-0 bg-neon-cyan/10 animate-pulse group-hover:bg-neon-cyan/20 transition-colors" />

                    {/* Orbiting Dots Container */}
                    <div className="absolute inset-0 animate-spin [animation-duration:3s]">
                        {/* Cyan Dot - Orbit 1 */}
                        <div className="absolute top-1 left-1/2 w-1.5 h-1.5 bg-neon-cyan rounded-full shadow-[0_0_5px_#00f3ff]" />
                    </div>
                    <div className="absolute inset-0 animate-spin [animation-duration:2s] reverse">
                        {/* Magenta Dot - Orbit 2 (Counter-rotating) */}
                        <div className="absolute bottom-1 left-1/2 w-1.5 h-1.5 bg-neon-pink rounded-full shadow-[0_0_5px_#ff00ff]" />
                    </div>

                    {/* Ring Animation (Subtle) */}
                    <div className="absolute inset-0 border border-transparent border-t-neon-cyan/30 rounded-full animate-spin [animation-duration:4s]" />

                    {/* Icon (Larger) */}
                    <div className="relative z-10">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-neon-cyan drop-shadow-[0_0_5px_rgba(0,243,255,0.8)]">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.6 15L9 18l-1 1h8l-1-1-.6-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                </button>
            </div>

            {/* DESKTOP: 3D Floating Orb */}
            <div
                className={`hidden md:block fixed bottom-10 right-10 z-50 w-56 h-56 transition-all duration-500 ${isOpen ? 'opacity-0 scale-0 pointer-events-none' : 'opacity-100 scale-100'
                    }`}
            >
                <div
                    className="w-full h-full cursor-pointer relative flex items-center justify-center translate-x-12 translate-y-12"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={() => {
                        setIsHovered(false);
                        open();
                    }}
                >
                    {/* Glow Backdrop */}
                    <div className={`absolute inset-16 rounded-full blur-3xl transition-all duration-1000 ${effectiveIsHovered ? 'bg-neon-cyan/20' : 'bg-neon-pink/10'}`} />

                    <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ alpha: true }}>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[5, 5, 5]} intensity={3} color={effectiveIsHovered ? "#00f3ff" : "#ff00ff"} />
                        <CyberOrb isHovered={effectiveIsHovered} onClick={open} />
                    </Canvas>
                </div>
            </div>
        </>
    );
}
