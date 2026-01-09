"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Stars } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CTAButton } from "@/components/ui/cta-button";

// --- Game Constants ---
const LASER_SPEED = 1.5;
const ASTEROID_SPEED = 0.3;
const GAME_BOUNDS = { x: 14, y: 8 };

// --- Types ---
type Position = [number, number, number];
type GameState = "MENU" | "PLAYING" | "GAME_OVER";
interface Entity { id: string; position: Position }

// --- Components ---

function MovingGrid() {
    const gridRef = useRef<THREE.Group>(null!);
    useFrame((state) => {
        if (gridRef.current) {
            gridRef.current.position.z = (state.clock.getElapsedTime() * 10) % 2;
        }
    });
    return (
        <group ref={gridRef} position={[0, -3, 0]}>
            <gridHelper args={[40, 40, 0xff00ff, 0x1a1a1a]} />
            <gridHelper args={[40, 8, 0x00f3ff, 0x000000]} position={[0, 0.1, 0]} />
        </group>
    )
}

function Ship({ position }: { position: Position }) {
    const group = useRef<THREE.Group>(null!);
    const { pointer } = useThree();

    useFrame(() => {
        if (group.current) {
            group.current.rotation.z = -pointer.x * 0.5;
            group.current.rotation.x = pointer.y * 0.2;
        }
    });

    return (
        <group ref={group} position={position}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <coneGeometry args={[0.5, 2, 4]} />
                <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={0.5} wireframe />
            </mesh>
            <pointLight position={[0, 0, 1]} distance={2} intensity={2} color="cyan" />
        </group>
    );
}

function Explosion({ position, onComplete }: { position: Position, onComplete: () => void }) {
    const [scale, setScale] = useState(0);

    useFrame((_, delta) => {
        if (scale < 1.5) {
            const newScale = scale + delta * 5;
            setScale(newScale);
            if (newScale >= 1.5) {
                onComplete();
            }
        }
    });

    return (
        <mesh position={position} scale={scale}>
            <sphereGeometry args={[0.5, 8, 8]} />
            <meshBasicMaterial color="orange" wireframe transparent opacity={1 - scale / 1.5} />
        </mesh>
    )
}

export function GameScene() {
    const [gameState, setGameState] = useState<GameState>("MENU");
    const [score, setScore] = useState(0);
    const [explosions, setExplosions] = useState<{ id: string, position: Position }[]>([]);
    const [renderEntities, setRenderEntities] = useState<{ asteroids: Entity[], lasers: Entity[], shipPos: Position }>({ asteroids: [], lasers: [], shipPos: [0, 0, 0] });

    // Game State Ref for Logic Loop
    const gameStateRef = useRef({
        asteroids: [] as Entity[],
        lasers: [] as Entity[],
        shipPos: [0, 0, 0] as Position,
        score: 0,
        lastSpawn: 0,
        isGameOver: false
    });

    // Reset Game
    useEffect(() => {
        if (gameState === "PLAYING") {
            gameStateRef.current = {
                asteroids: [],
                lasers: [],
                shipPos: [0, 0, 0],
                score: 0,
                lastSpawn: 0,
                isGameOver: false
            };
            setScore(0);
            setExplosions([]);
            setRenderEntities({ asteroids: [], lasers: [], shipPos: [0, 0, 0] });
        }
    }, [gameState]);

    // Logic Loop Component
    const GameLoop = () => {
        const { pointer, viewport } = useThree();

        useFrame((state) => {
            if (gameState !== "PLAYING" || gameStateRef.current.isGameOver) return;

            const time = state.clock.getElapsedTime();
            const ref = gameStateRef.current;

            // 1. Update Ship Position
            const x = (pointer.x * viewport.width) / 2;
            const y = (pointer.y * viewport.height) / 2;
            const clampedX = Math.max(-GAME_BOUNDS.x, Math.min(GAME_BOUNDS.x, x));
            const clampedY = Math.max(-GAME_BOUNDS.y, Math.min(GAME_BOUNDS.y, y));
            ref.shipPos = [clampedX, clampedY, 0];

            // 2. Spawn Asteroids
            const difficultyMultiplier = 1 + (ref.score * 0.0005);
            const spawnInterval = Math.max(0.1, 0.5 - (ref.score * 0.0001));

            if (time - ref.lastSpawn > spawnInterval) {
                ref.lastSpawn = time;
                if (Math.random() > 0.3) {
                    const id = Math.random().toString(36).substr(2, 9);
                    const startX = (Math.random() - 0.5) * viewport.width * 1.5;
                    const startY = (Math.random() - 0.5) * viewport.height * 1.2;
                    ref.asteroids.push({ id, position: [startX, startY, -50] });
                }
            }

            // 3. Move Lasers
            for (let i = ref.lasers.length - 1; i >= 0; i--) {
                ref.lasers[i].position[2] -= LASER_SPEED;
                if (ref.lasers[i].position[2] < -60) {
                    ref.lasers.splice(i, 1);
                }
            }

            // 4. Move Asteroids & Check Collision
            const asteroidSpeed = ASTEROID_SPEED * difficultyMultiplier;
            for (let i = ref.asteroids.length - 1; i >= 0; i--) {
                const ast = ref.asteroids[i];
                ast.position[2] += asteroidSpeed;

                // Collision with Ship
                const dx = ast.position[0] - ref.shipPos[0];
                const dy = ast.position[1] - ref.shipPos[1];
                const dz = ast.position[2] - ref.shipPos[2];
                if (Math.abs(dz) < 1 && Math.sqrt(dx * dx + dy * dy) < 1.0) {
                    ref.isGameOver = true;
                    setGameState("GAME_OVER");
                }

                if (ast.position[2] > 5) {
                    ref.asteroids.splice(i, 1);
                }
            }

            // 5. Collision Lasers vs Asteroids
            let scoreChanged = false;
            for (let i = ref.lasers.length - 1; i >= 0; i--) {
                let laserHit = false;
                for (let j = ref.asteroids.length - 1; j >= 0; j--) {
                    const l = ref.lasers[i];
                    const a = ref.asteroids[j]; // Access from ref, not state

                    const dx = l.position[0] - a.position[0];
                    const dy = l.position[1] - a.position[1];
                    const dz = l.position[2] - a.position[2];

                    if (Math.sqrt(dx * dx + dy * dy + dz * dz) < 1.5) {
                        setExplosions(prev => [...prev, { id: Math.random().toString(), position: [...a.position] as Position }]);
                        ref.asteroids.splice(j, 1);
                        ref.score += 100;
                        scoreChanged = true;
                        laserHit = true;
                        break;
                    }
                }
                if (laserHit) {
                    ref.lasers.splice(i, 1);
                }
            }

            if (scoreChanged) {
                setScore(ref.score);
            }

            // 6. Sync to Render State
            setRenderEntities({
                asteroids: [...ref.asteroids],
                lasers: [...ref.lasers],
                shipPos: ref.shipPos
            });
        });
        return null;
    };

    return (
        <div className="w-full h-screen bg-black relative overflow-hidden font-mono">
            {/* UI Overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start pointer-events-auto">
                    <Link href="/">
                        <div className="flex items-center gap-2 text-neon-cyan hover:text-white transition-colors cursor-pointer bg-black/50 p-2 rounded border border-neon-cyan/30">
                            <ArrowLeft className="w-5 h-5" />
                            <span>MISSION ABORT</span>
                        </div>
                    </Link>
                    <div className="text-right">
                        <div className="text-4xl font-bold text-white tracking-tighter drop-shadow-[0_0_10px_rgba(0,243,255,0.8)]">
                            {score.toString().padStart(6, '0')}
                        </div>
                        <div className="text-xs text-neon-pink tracking-widest">SCORE</div>
                    </div>
                </div>

                {gameState === "MENU" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-auto">
                        <div className="text-center space-y-6 max-w-md">
                            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-t from-neon-blue to-white tracking-tighter filter drop-shadow-[0_0_20px_rgba(0,243,255,0.5)]">
                                ASTEROID FIELD
                            </h1>
                            <p className="text-slate-300">
                                PILOT THE SHIP WITH YOUR MOUSE.<br />
                                CLICK TO SHOOT.<br />
                                SURVIVE.
                            </p>
                            <CTAButton variant="primary" onClick={() => setGameState("PLAYING")} className="mx-auto" trackingLabel="Start Game" trackingLocation="Game">
                                INITIALIZE SEQUENCE
                            </CTAButton>
                        </div>
                    </div>
                )}

                {gameState === "GAME_OVER" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-900/20 backdrop-blur-sm pointer-events-auto">
                        <div className="text-center space-y-6">
                            <h2 className="text-5xl font-bold text-red-500 tracking-widest glitch-text">MISSION FAILED</h2>
                            <div className="text-2xl text-white">FINAL SCORE: {score}</div>
                            <CTAButton variant="secondary" onClick={() => {
                                setGameState("PLAYING");
                            }} className="mx-auto" trackingLabel="Restart Game" trackingLocation="Game">
                                RETRY MISSION
                            </CTAButton>
                        </div>
                    </div>
                )}
            </div>

            <Canvas
                className="w-full h-full"
                dpr={[1, 2]}
                gl={{ antialias: true, toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.5 }}
                onPointerDown={() => {
                    if (gameState === "PLAYING" && !gameStateRef.current.isGameOver) {
                        const id = Math.random().toString(36).substr(2, 9);
                        gameStateRef.current.lasers.push({ id, position: [...gameStateRef.current.shipPos] });
                    }
                }}
            >
                <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={75} />
                <color attach="background" args={["#000000"]} />
                <fog attach="fog" args={['#000', 5, 50]} />

                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 5]} intensity={1} color="#ff00ff" />
                <pointLight position={[-10, -5, -5]} color="#00f3ff" intensity={2} />

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <MovingGrid />

                {gameState === "PLAYING" && <GameLoop />}

                {(gameState === "PLAYING" || gameState === "GAME_OVER") && (
                    <>
                        <Ship position={renderEntities.shipPos} />

                        {renderEntities.lasers.map((laser) => (
                            <mesh key={laser.id} position={laser.position} rotation={[Math.PI / 2, 0, 0]}>
                                <cylinderGeometry args={[0.08, 0.08, 1.5]} />
                                <meshBasicMaterial color="#00ff00" toneMapped={false} />
                            </mesh>
                        ))}

                        {renderEntities.asteroids.map((asteroid) => (
                            <mesh key={asteroid.id} position={asteroid.position}>
                                <dodecahedronGeometry args={[0.8, 0]} />
                                <meshStandardMaterial color="#ff00ff" wireframe />
                            </mesh>
                        ))}
                    </>
                )}

                {explosions.map(exp => (
                    <Explosion key={exp.id} position={exp.position} onComplete={() => {
                        setExplosions(prev => prev.filter(e => e.id !== exp.id));
                    }} />
                ))}

            </Canvas>
        </div>
    );
}
