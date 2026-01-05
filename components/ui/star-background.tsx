"use client";

import { Canvas } from "@react-three/fiber";
import { Stars, Sparkles } from "@react-three/drei";

export function StarBackground() {
    return (
        <div className="fixed inset-0 z-0 bg-black pointer-events-none">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
                <Sparkles count={200} scale={10} size={2} speed={0.4} opacity={0.5} color="#00f3ff" />
            </Canvas>
        </div>
    );
}
