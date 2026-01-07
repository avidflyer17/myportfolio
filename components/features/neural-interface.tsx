"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Terminal, Cpu } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { cn } from '@/lib/utils';

interface NeuralInterfaceProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

// Composant pour l'hologramme 3D pendant le traitement
function ProcessingHologram() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center justify-center py-8"
        >
            <div className="relative">
                {/* Icône centrale en rotation 3D */}
                <motion.div
                    animate={{
                        rotateY: [0, 360],
                        rotateX: [0, 15, 0, -15, 0],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="relative"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    <Cpu className="w-12 h-12 text-neon-cyan drop-shadow-[0_0_15px_rgba(0,243,255,0.8)]" />
                </motion.div>

                {/* Cercles d'énergie pulsants */}
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0, 0.5]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute inset-0 rounded-full border-2 border-neon-cyan"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.8, 1],
                        opacity: [0.3, 0, 0.3]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                    }}
                    className="absolute inset-0 rounded-full border-2 border-neon-pink"
                />
            </div>

            {/* Texte animé */}
            <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute mt-24 text-xs text-neon-cyan font-mono tracking-wider"
            >
                NEURAL_SYNAPSES_FIRING<motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}>...</motion.span>
            </motion.div>
        </motion.div>
    );
}



// Composant pour les particules d'énergie
function EnergyParticles({ active }: { active: boolean }) {
    const particles = Array.from({ length: active ? 20 : 8 }, (_, i) => ({
        id: i,
        delay: Math.random() * 3,
        duration: 3 + Math.random() * 2,
        x: Math.random() * 100,
        size: 1 + Math.random() * 2
    }));

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full"
                    style={{
                        left: `${particle.x}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        background: particle.id % 2 === 0 ? '#00f3ff' : '#ff00ff',
                        boxShadow: `0 0 ${particle.size * 5}px currentColor`,
                    }}
                    animate={{
                        y: ['100vh', '-10vh'],
                        opacity: [0, 1, 1, 0]
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        delay: particle.delay,
                        ease: 'linear'
                    }}
                />
            ))}
        </div>
    );
}

export function NeuralInterface({ isOpen, onClose }: NeuralInterfaceProps) {
    const t = useTranslations('neuralInterface');
    const locale = useLocale();

    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'init-1',
            role: 'assistant',
            content: t('initialMessage')
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isBooting, setIsBooting] = useState(true);
    const [visitorId, setVisitorId] = useState<string>('VISITOR_UNKNOWN_XX');

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Fetch visitor location and generate ID
    useEffect(() => {
        if (isOpen && visitorId === 'VISITOR_UNKNOWN_XX') {
            fetch('/api/location')
                .then(res => res.json())
                .then(data => {
                    const city = (data.city || 'UNKNOWN').toUpperCase().replace(/[^A-Z0-9]/g, '_');
                    const countryCode = (data.country_code || data.country || 'XX').toUpperCase().slice(0, 2);
                    setVisitorId(`VISITOR_${city}_${countryCode}`);
                })
                .catch(() => {
                    // Keep default VISITOR_UNKNOWN_XX on error
                    console.log('Could not fetch visitor location');
                });
        }
    }, [isOpen, visitorId]);

    // Simulated Boot Sequence
    useEffect(() => {
        if (isOpen) {
            setIsBooting(true);
            const timer = setTimeout(() => setIsBooting(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                    locale: locale
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let assistantContent = '';

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: ''
            };

            setMessages(prev => [...prev, assistantMessage]);

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    assistantContent += chunk;

                    setMessages(prev => {
                        const updated = [...prev];
                        const lastMsg = updated[updated.length - 1];
                        if (lastMsg.role === 'assistant') {
                            lastMsg.content = assistantContent;
                        }
                        return updated;
                    });
                }
            }

        } catch (err) {
            console.error("Neural Interface [Submit Error]:", err);
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="neural-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    style={{ perspective: "1000px" }}
                    onClick={onClose}
                >
                    <motion.div
                        key="neural-modal"
                        onClick={(e) => e.stopPropagation()}
                        className={cn(
                            "w-full max-w-2xl h-[600px] flex flex-col bg-black/90 rounded-lg overflow-hidden font-mono relative",
                            "border-2 transition-all duration-300",
                            isLoading
                                ? "border-neon-cyan shadow-[0_0_30px_rgba(0,243,255,0.4),0_0_60px_rgba(0,243,255,0.2),inset_0_0_30px_rgba(0,243,255,0.1)]"
                                : "border-neon-cyan/30 shadow-[0_0_50px_rgba(0,243,255,0.15)]"
                        )}
                        initial={{ opacity: 0, scale: 0.8, rotateX: 90, y: 100 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            rotateX: 0,
                            y: 0,
                            ...(isLoading ? {
                                boxShadow: [
                                    '0 0 30px rgba(0,243,255,0.4), 0 0 60px rgba(0,243,255,0.2), inset 0 0 30px rgba(0,243,255,0.1)',
                                    '0 0 40px rgba(0,243,255,0.6), 0 0 80px rgba(0,243,255,0.3), inset 0 0 40px rgba(0,243,255,0.15)',
                                    '0 0 30px rgba(0,243,255,0.4), 0 0 60px rgba(0,243,255,0.2), inset 0 0 30px rgba(0,243,255,0.1)',
                                ]
                            } : {})
                        }}
                        exit={{ opacity: 0, scale: 0.5, rotateY: 90, x: 100, boxShadow: "none" }}
                        transition={{
                            default: { type: "spring", stiffness: 100, damping: 15, duration: 0.6 },
                            opacity: { duration: 0.4 },
                            boxShadow: { duration: 2, repeat: isLoading ? Infinity : 0, ease: "easeInOut" }
                        }}
                    >


                        {/* Energy Particles */}
                        <EnergyParticles active={isLoading} />

                        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5 bg-[size:20px_20px] pointer-events-none" />

                        <div className="flex items-center justify-between px-4 py-3 border-b border-neon-cyan/20 bg-black/50 backdrop-blur top-0 z-10 relative">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50 cursor-pointer hover:bg-red-500/40 transition-colors" onClick={onClose} role="button" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                                <div className="h-4 w-[1px] bg-white/10 mx-2" />
                                <motion.span
                                    className="text-neon-cyan text-xs tracking-widest flex items-center gap-2"
                                    animate={{
                                        textShadow: [
                                            '0 0 10px rgba(0,243,255,0.8)',
                                            '0 0 20px rgba(0,243,255,1), 2px 0 5px rgba(255,0,255,0.5)',
                                            '0 0 10px rgba(0,243,255,0.8)'
                                        ]
                                    }}
                                    transition={{
                                        duration: 0.15,
                                        repeat: Infinity,
                                        repeatDelay: 4
                                    }}
                                >
                                    <Terminal size={12} />
                                    {t('title')}
                                </motion.span>
                            </div>
                            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 relative custom-scrollbar">
                            {isBooting ? (
                                <div className="space-y-1 text-xs text-green-500/80 font-mono">
                                    <p>{t('systemInit')}</p>
                                    <p>{t('loadingWeights')}</p>
                                    <p className="animate-pulse">{t('waitingInput')}</p>
                                </div>
                            ) : (
                                <>

                                    {messages.map((m, index) => (
                                        <motion.div
                                            key={m.id}
                                            initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={cn(
                                                "flex flex-col max-w-[85%] text-sm p-3 rounded-lg mb-2",
                                                m.role === 'user'
                                                    ? "self-end bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan ml-auto"
                                                    : "self-start bg-white/5 border border-white/10 text-slate-300 mr-auto"
                                            )}
                                        >
                                            <span className="text-[10px] opacity-50 mb-1 font-bold tracking-wider">
                                                {m.role === 'user' ? visitorId : t('title')}
                                            </span>
                                            <div className="whitespace-pre-wrap leading-relaxed">
                                                {m.content.split(/(\[[^\]]+\]\(#[^)]+\))/g).map((part, i) => {
                                                    const match = part.match(/\[([^\]]+)\]\(#([^)]+)\)/);
                                                    if (match) {
                                                        const [_, text, id] = match;
                                                        return (
                                                            <button
                                                                key={i}
                                                                onClick={() => {
                                                                    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                                    onClose();
                                                                }}
                                                                className="text-neon-cyan hover:underline hover:text-white font-bold cursor-pointer inline-flex items-center gap-1"
                                                            >
                                                                {text}
                                                                <span className="text-[10px] opacity-70">↗</span>
                                                            </button>
                                                        );
                                                    }
                                                    return part;
                                                })}
                                            </div>
                                        </motion.div>
                                    ))}

                                    {isLoading && <ProcessingHologram />}

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="self-center text-red-500 text-[10px] animate-pulse p-2 border border-red-500/30 bg-red-500/5 rounded"
                                        >
                                            {t('error')}: {error}
                                        </motion.div>
                                    )}
                                </>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleFormSubmit} className="p-4 border-t border-white/10 bg-black/80 backdrop-blur relative z-10">
                            <div className="relative flex items-center">
                                <span className="absolute left-3 text-neon-cyan animate-pulse">{'>'}</span>
                                <input
                                    className="w-full bg-black/50 border border-white/10 rounded px-8 py-3 text-white focus:outline-none focus:border-neon-cyan/50 font-mono text-base md:text-sm placeholder:text-slate-600 focus:shadow-[0_0_15px_rgba(0,243,255,0.1)] transition-all"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={isBooting ? t('initializing') : t('inputPlaceholder')}
                                    disabled={isBooting}
                                    autoFocus
                                />
                                <button type="submit" disabled={isLoading || isBooting || !input.trim()} className="absolute right-2 p-1.5 text-neon-cyan hover:text-white disabled:opacity-30 transition-colors">
                                    <Send size={16} />
                                </button>
                            </div>
                        </form>
                    </motion.div>


                </motion.div>
            )}
        </AnimatePresence>
    );
}
