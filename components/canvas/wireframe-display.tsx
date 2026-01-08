"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, Torus, Cone, Cylinder, Box, Icosahedron, Dodecahedron, Octahedron } from "@react-three/drei";
import * as THREE from "three";

type WireframeVariant = 'architecture' | 'product' | 'business' | 'startup' | 'default';

function ArchitectureShape() {
    // "Cloud Infrastructure": Central hub with orbiting nodes
    const groupRef = useRef<THREE.Group>(null!);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
        }
    });

    return (
        <group ref={groupRef} rotation={[0, 0, Math.PI / 6]}>
            {/* Central Server/Core */}
            <Icosahedron args={[1, 1]}>
                <meshBasicMaterial color="#00f3ff" wireframe transparent opacity={0.3} />
            </Icosahedron>

            {/* Stable Satellite */}
            <Sphere args={[0.3]} position={[1.5, 0, 0]}>
                <meshBasicMaterial color="#ff00ff" wireframe />
            </Sphere>

            {/* Distant Node */}
            <Sphere args={[0.25]} position={[-1.2, 1, 0.5]}>
                <meshBasicMaterial color="#00f3ff" wireframe />
            </Sphere>

            {/* Orbit rings to suggest connection */}
            <Torus args={[1.6, 0.02, 16, 64]} rotation={[Math.PI / 2, 0, 0]}>
                <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
            </Torus>
        </group>
    );
}

function ProductShape() {
    // "Management/Process": Abstract Gyroscope representing balance and cycle
    // High-tech wireframe rings
    const ring1 = useRef<THREE.Mesh>(null!);
    const ring2 = useRef<THREE.Mesh>(null!);
    const ring3 = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (ring1.current && ring2.current && ring3.current) {
            ring1.current.rotation.x = t * 0.5;
            ring1.current.rotation.y = t * 0.2;

            ring2.current.rotation.x = t * 0.3;
            ring2.current.rotation.z = t * 0.4;

            ring3.current.rotation.y = t * 0.6;
        }
    });

    return (
        <group scale={0.8}>
            {/* Outer Ring */}
            <Torus ref={ring1} args={[1.5, 0.05, 16, 100]}>
                <meshBasicMaterial color="#00f3ff" wireframe transparent opacity={0.6} />
            </Torus>

            {/* Middle Ring */}
            <Torus ref={ring2} args={[1.1, 0.05, 16, 100]}>
                <meshBasicMaterial color="#ff00ff" wireframe transparent opacity={0.6} />
            </Torus>

            {/* Inner Ring */}
            <Torus ref={ring3} args={[0.7, 0.08, 16, 100]}>
                <meshBasicMaterial color="#00f3ff" wireframe transparent opacity={0.8} />
            </Torus>

            {/* Core */}
            <Icosahedron args={[0.3, 0]}>
                <meshBasicMaterial color="#ffffff" wireframe />
            </Icosahedron>
        </group>
    );
}

function BusinessShape() {
    // "Global Connectivity": Large Orbital Relay
    // HUGE Volume, Lots of movement
    const groupRef = useRef<THREE.Group>(null!);
    const ring1Ref = useRef<THREE.Group>(null!);
    const ring2Ref = useRef<THREE.Group>(null!);
    const ring3Ref = useRef<THREE.Group>(null!);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (ring1Ref.current) ring1Ref.current.rotation.x = t * 0.4;
        if (ring2Ref.current) ring2Ref.current.rotation.y = t * 0.5;
        if (ring3Ref.current) ring3Ref.current.rotation.z = t * 0.3;

        // Gentle pulse of the whole group
        if (groupRef.current) {
            groupRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.05);
        }
    });

    return (
        <group ref={groupRef} scale={0.6}>
            {/* Large Central Core */}
            <Dodecahedron args={[0.8, 0]}>
                <meshBasicMaterial color="#ff00ff" wireframe transparent opacity={0.6} />
            </Dodecahedron>
            <Octahedron args={[0.4]}>
                <meshBasicMaterial color="#ffffff" wireframe />
            </Octahedron>

            {/* Dynamic Rings on all axes */}
            <group ref={ring1Ref}>
                <Torus args={[1.4, 0.03, 16, 64]}>
                    <meshBasicMaterial color="#00f3ff" wireframe transparent opacity={0.4} />
                    {/* Satellite on ring */}
                    <Sphere args={[0.1]} position={[1.4, 0, 0]}>
                        <meshBasicMaterial color="#ffffff" />
                    </Sphere>
                </Torus>
            </group>

            <group ref={ring2Ref}>
                <Torus args={[1.8, 0.03, 16, 64]} rotation={[Math.PI / 2, 0, 0]}>
                    <meshBasicMaterial color="#00f3ff" wireframe transparent opacity={0.3} />
                    <Sphere args={[0.1]} position={[1.8, 0, 0]}>
                        <meshBasicMaterial color="#ffffff" />
                    </Sphere>
                </Torus>
            </group>

            <group ref={ring3Ref}>
                <Torus args={[2.2, 0.02, 16, 64]} rotation={[0, Math.PI / 2, 0]}>
                    <meshBasicMaterial color="#00f3ff" wireframe transparent opacity={0.2} />
                    <Sphere args={[0.1]} position={[2.2, 0, 0]}>
                        <meshBasicMaterial color="#ffffff" />
                    </Sphere>
                </Torus>
            </group>
        </group>
    );
}

function StartupShape() {
    // "Creation & Growth": Dynamic Construct
    // Volume through expansion/contraction
    const groupRef = useRef<THREE.Group>(null!);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        // Breathing animation
        if (groupRef.current) {
            // Expansion
            const scale = 1 + Math.sin(t) * 0.2;
            groupRef.current.scale.setScalar(scale);

            // Rotation
            groupRef.current.rotation.x = t * 0.3;
            groupRef.current.rotation.y = t * 0.4;
        }
    });

    // Positions for corners of a cube
    const corners = [
        [1, 1, 1], [-1, 1, 1], [1, -1, 1], [-1, -1, 1],
        [1, 1, -1], [-1, 1, -1], [1, -1, -1], [-1, -1, -1]
    ];

    return (
        <group ref={groupRef}>
            {/* Central Hub */}
            <Box args={[0.8, 0.8, 0.8]}>
                <meshBasicMaterial color="#ff00ff" wireframe transparent opacity={0.5} />
            </Box>

            {/* Expanding Corners */}
            {corners.map((pos, i) => (
                <group key={i} position={[pos[0] * 0.8, pos[1] * 0.8, pos[2] * 0.8]}>
                    <Box args={[0.4, 0.4, 0.4]}>
                        <meshBasicMaterial color="#00f3ff" wireframe />
                    </Box>
                </group>
            ))}

            {/* Connecting lines implied by wireframe, or we can add internal structure */}
            <Octahedron args={[1.5]}>
                <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.1} />
            </Octahedron>
        </group>
    );
}


function SceneContent({ variant }: { variant: WireframeVariant }) {
    const groupRef = useRef<THREE.Group>(null!);

    useFrame((state) => {
        if (!groupRef.current) return;

        const t = state.clock.getElapsedTime();

        // Product and Business handle their own complex rotations
        if (variant === 'architecture' || variant === 'startup') {
            groupRef.current.rotation.y = t * 0.1;
        }

        if (variant !== 'product') {
            groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.05;
        }
    });

    const renderShape = () => {
        switch (variant) {
            case 'architecture':
                return <ArchitectureShape />;
            case 'product':
                return <ProductShape />;
            case 'business':
                return <BusinessShape />;
            case 'startup':
                return <StartupShape />;
            default:
                return <ArchitectureShape />;
        }
    };

    return (
        <group ref={groupRef} scale={0.8}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                {renderShape()}
            </Float>
        </group>
    );
}

interface WireframeDisplayProps {
    variant?: WireframeVariant;
    className?: string;
}

export function WireframeDisplay({ variant = 'default', className = "" }: WireframeDisplayProps) {
    return (
        <div className={`w-full h-[300px] ${className}`}>
            <Canvas
                resize={{ scroll: false }}
                camera={{ position: [0, 0, 12], fov: 45 }}
                gl={{ alpha: true, antialias: true }}
            >
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} color="#00f3ff" intensity={1} />
                <pointLight position={[-10, -10, -10]} color="#ff00ff" intensity={1} />

                <SceneContent variant={variant} />
            </Canvas>
        </div>
    );
}
