
"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Instance, Instances } from "@react-three/drei";
import * as THREE from "three";

const BUILDING_COUNT = 40;
const RANGE = 4;

type BuildingData = {
    position: [number, number, number];
    scale: [number, number, number];
};

function Buildings() {
    const buildingsRef = useRef<THREE.Group>(null!);
    const [buildings, setBuildings] = useState<BuildingData[]>([]);

    useFrame((_state) => {
        if (buildingsRef.current) {
            buildingsRef.current.rotation.y += 0.002;
        }
    });

    useEffect(() => {
        const newBuildings = Array.from({ length: BUILDING_COUNT }, () => ({
            position: [
                (Math.random() - 0.5) * RANGE * 2,
                0,
                (Math.random() - 0.5) * RANGE * 2,
            ] as [number, number, number],
            scale: [
                0.2 + Math.random() * 0.5,
                0.5 + Math.random() * 2.5,
                0.2 + Math.random() * 0.5,
            ] as [number, number, number],
        }));
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setBuildings(newBuildings);
    }, []);

    return (
        <group ref={buildingsRef}>
            <Instances range={BUILDING_COUNT}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial
                    color="#00f3ff"
                    emissive="#00f3ff"
                    emissiveIntensity={0.5}
                    roughness={0.1}
                    metalness={0.8}
                    wireframe={true}
                />

                {buildings.map((data, i) => (
                    <Instance
                        key={i}
                        position={[data.position[0], data.scale[1] / 2, data.position[2]]}
                        scale={data.scale}
                    />
                ))}
            </Instances>

            {/* Holographic Base Grid */}
            <gridHelper args={[10, 20]} position={[0, 0, 0]} rotation={[0, 0, 0]}>
                <lineBasicMaterial attach="material" color="#ff00ff" transparent opacity={0.2} />
            </gridHelper>
        </group>
    );
}

export function CityMap() {
    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#00f3ff" />
            <pointLight position={[-10, 5, -10]} intensity={0.5} color="#ff00ff" />

            <Buildings />

            {/* City Drones (Simple moving particles) */}
            <DroneOrbit speed={1} radius={2.5} y={2} color="#ff00ff" />
            <DroneOrbit speed={-0.8} radius={3.5} y={1.5} color="#00f3ff" />
        </>
    );
}

function DroneOrbit({ speed, radius, y, color }: { speed: number; radius: number; y: number; color: string }) {
    const ref = useRef<THREE.Mesh>(null!);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime() * speed;
        ref.current.position.x = Math.cos(t) * radius;
        ref.current.position.z = Math.sin(t) * radius;
    });

    return (
        <mesh ref={ref} position={[radius, y, 0]}>
            <octahedronGeometry args={[0.1]} />
            <meshBasicMaterial color={color} />
        </mesh>
    );
}
