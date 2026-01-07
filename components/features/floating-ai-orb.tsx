"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Sphere, MeshDistortMaterial, Html } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Sparkles } from "lucide-react";
import { NeuralInterface, useNeuralInterface } from "@/components/features/neural-interface";
import { useTranslations } from 'next-intl';
import * as THREE from 'three';


function CyberOrb({ isHovered, onClick }: { isHovered: boolean; onClick: () => void }) {
    const meshRef = useRef<any>(null);
    const nodesRef = useRef<any>(null);
    const wireRef = useRef<any>(null);
    const outerRef = useRef<any>(null);
    const groupRef = useRef<any>(null);

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

    // Reset hover state when the orb re-appears to prevent it being stuck "white/hover"
    useEffect(() => {
        if (!isOpen) {
            setIsHovered(false);
        }
    }, [isOpen]);

    if (isOpen) return null;

    return (
        <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 w-32 h-32 md:w-56 md:h-56">
            {/* Minimalist Tooltip */}
            <AnimatePresence>
                {!isOpen && !isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ delay: 3 }}
                        onAnimationComplete={() => {
                            setTimeout(() => {
                                const el = document.getElementById('orb-tooltip');
                                if (el) el.style.opacity = '0';
                            }, 10000);
                        }}
                        id="orb-tooltip"
                        className="absolute bottom-[75%] right-8 mb-4 pointer-events-none transition-opacity duration-1000"
                    >
                        <div className="bg-black/90 border border-neon-cyan/40 p-2 font-mono rounded shadow-[0_0_20px_rgba(0,243,255,0.2)]">
                            <div className="flex items-center gap-2 mb-1 border-b border-neon-cyan/20 pb-1">
                                <div className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-pulse" />
                                <span className="text-[9px] text-neon-cyan uppercase tracking-tighter">System_Active</span>
                            </div>
                            <div className="text-white text-[11px] font-bold">
                                {t('orbTooltip')}
                            </div>
                            <div className="text-[9px] text-neon-cyan/60 mt-0.5">
                                {'>'} {t('orbStatus')}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div
                className="w-full h-full cursor-pointer relative flex items-center justify-center translate-x-4 translate-y-4 md:translate-x-12 md:translate-y-12"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={open}
            >
                {/* Glow Backdrop */}
                <div className={`absolute inset-16 rounded-full blur-3xl transition-all duration-1000 ${isHovered ? 'bg-neon-cyan/20' : 'bg-neon-pink/10'}`} />

                <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ alpha: true }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[5, 5, 5]} intensity={3} color={isHovered ? "#00f3ff" : "#ff00ff"} />
                    <CyberOrb isHovered={isHovered} onClick={open} />
                </Canvas>
            </div>
        </div>
    );
}
