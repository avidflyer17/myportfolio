"use client";


import { Send, X, Terminal, Loader2, ExternalLink, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState, createContext, useContext } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import { WarpSpeed } from '@/components/ui/warp-speed';

// --- Context for Global Access ---
interface NeuralInterfaceContextType {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}

const NeuralInterfaceContext = createContext<NeuralInterfaceContextType | undefined>(undefined);

// Signal for external components to switch view
export const CONTACT_VIEW_SIGNAL = 'site:switch_contact_view';

export function useNeuralInterface() {
    const context = useContext(NeuralInterfaceContext);
    if (!context) {
        throw new Error('useNeuralInterface must be used within a NeuralInterfaceProvider');
    }
    return context;
}

export function NeuralInterfaceProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <NeuralInterfaceContext.Provider value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}>
            {children}
            <NeuralInterface isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </NeuralInterfaceContext.Provider>
    );
}

// --- Internal Component ---
interface NeuralInterfaceProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
}

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

function EnergyParticles({ active }: { active: boolean }) {
    const [particles, setParticles] = useState<{ id: number; delay: number; duration: number; x: number; size: number }[]>([]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setParticles(Array.from({ length: active ? 20 : 8 }, (_, i) => ({
            id: i,
            delay: Math.random() * 3,
            duration: 3 + Math.random() * 2,
            x: Math.random() * 100,
            size: 1 + Math.random() * 2
        })));
    }, [active]);

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

    // Contact Protocol States
    const [contactState, setContactState] = useState<'idle' | 'executing' | 'success'>('idle');
    const [isAIUnavailable, setIsAIUnavailable] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, contactState, error, isAIUnavailable, isRedirecting]);

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
                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        const chunk = decoder.decode(value, { stream: true });
                        assistantContent += chunk;

                        // CHECK FOR JSON TOOL CALL
                        if (assistantContent.includes('```json')) {
                            const jsonMatch = assistantContent.match(/```json\n([\s\S]*?)\n```/);
                            if (jsonMatch) {
                                try {
                                    const toolCall = JSON.parse(jsonMatch[1]);
                                    if (toolCall.tool === 'send_email') {
                                        setContactState('executing');
                                        import('@/app/actions').then(async ({ sendContactEmailJSON }) => {
                                            const result = await sendContactEmailJSON(toolCall.data);
                                            if (result.success) {
                                                setContactState('success');
                                                setTimeout(() => {
                                                    onClose();
                                                    setContactState('idle');
                                                    setMessages(prev => [...prev, {
                                                        id: 'sys-end',
                                                        role: 'assistant',
                                                        content: '[SYSTEM] Transmission confirmed. Closing connection.'
                                                    }]);
                                                }, 6000);
                                            } else {
                                                setMessages(prev => [...prev, {
                                                    id: 'err-send',
                                                    role: 'assistant',
                                                    content: `[ERROR] Transmission failed: ${result.error}`
                                                }]);
                                                setContactState('idle');
                                            }
                                        });
                                        assistantContent = assistantContent.replace(/```json[\s\S]*```/, 'Processing transmission request...');
                                    }
                                } catch {
                                    // JSON Parsing Error - ignore
                                }
                            }
                        }

                        setMessages(prev => {
                            const updated = [...prev];
                            const lastMsg = updated[updated.length - 1];
                            if (lastMsg && lastMsg.role === 'assistant') {
                                lastMsg.content = assistantContent;
                            }
                            return updated;
                        });
                    }
                } finally {
                    reader.releaseLock();
                }
            }

            // Force error if we got absolutely nothing (likely silent quota fail)
            if (!assistantContent.trim()) {
                throw new Error("COMMUNICATION_FAILURE: Zero packets received. Quota or system limit reached.");
            }

        } catch (err) {
            // Log for dev but don't let it crash the UI
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);

            // Force fallback if any error occurs
            setIsAIUnavailable(true);

            // CLEANUP: Remove empty assistant bubbles
            setMessages(prev => prev.filter(m => {
                if (m.role === 'assistant') return m.content.trim() !== '';
                return true;
            }));
        } finally {
            setIsLoading(false);
        }
    };

    const handleFallbackRedirect = () => {
        setIsRedirecting(true);
        setTimeout(() => {
            onClose();

            // Emit signal to switch ContactSection to 'classic' view
            window.dispatchEvent(new CustomEvent(CONTACT_VIEW_SIGNAL, { detail: 'classic' }));

            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }

            setIsRedirecting(false);
            setIsAIUnavailable(false);
        }, 1500);
    };

    return (
        <AnimatePresence>
            {/* SUCCESS FULLSCREEN OVERLAY */}
            {contactState === 'success' && (
                <motion.div
                    key="success-overlay"
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <WarpSpeed active={true} />
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.5, z: -100 }}
                        animate={{ opacity: 1, scale: 1.5, z: 0 }}
                        transition={{ duration: 1, type: "spring" }}
                        className="relative z-[110] text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-pink italic tracking-tighter text-center"
                        style={{ textShadow: '0 0 50px rgba(0,243,255,0.8)' }}
                    >
                        {locale === 'en' ? 'TRANSMISSION SENT' : 'TRANSMISSION ENVOYÉE'}
                    </motion.h2>
                </motion.div>
            )}

            {isOpen && contactState !== 'success' && (
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
                            (isLoading || contactState === 'executing')
                                ? "border-neon-cyan shadow-[0_0_30px_rgba(0,243,255,0.4),0_0_60px_rgba(0,243,255,0.2),inset_0_0_30px_rgba(0,243,255,0.1)]"
                                : "border-neon-cyan/30 shadow-[0_0_50px_rgba(0,243,255,0.15)]"
                        )}
                        initial={{ opacity: 0, scale: 0.8, rotateX: 90, y: 100 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            rotateX: 0,
                            y: 0,
                        }}
                        exit={{ opacity: 0, scale: 0.5, rotateY: 90, x: 100, boxShadow: "none" }}
                    >
                        {/* Energy Particles */}
                        <EnergyParticles active={isLoading || contactState === 'executing'} />

                        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5 bg-[size:20px_20px] pointer-events-none" />

                        <div className="flex items-center justify-between px-4 py-3 border-b border-neon-cyan/20 bg-black/50 backdrop-blur top-0 z-10 relative">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50 cursor-pointer hover:bg-red-500/40 transition-colors" onClick={onClose} role="button" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                                <div className="h-4 w-[1px] bg-white/10 mx-2" />
                                <motion.span className="text-neon-cyan text-xs tracking-widest flex items-center gap-2">
                                    <Terminal size={12} />
                                    {contactState === 'executing' ? 'TRANSMITTING...' : t('title')}
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
                                    {messages.map((m) => (
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
                                                {m.content}
                                            </div>
                                        </motion.div>
                                    ))}

                                    {(isLoading || contactState === 'executing') && <ProcessingHologram />}

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="self-center w-full mt-4"
                                        >
                                            <div className="text-red-500 text-[10px] animate-pulse p-2 border border-red-500/30 bg-red-500/5 rounded text-center">
                                                {t('error')}: {error}
                                            </div>
                                        </motion.div>
                                    )}

                                    {isAIUnavailable && (
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            className="self-center w-full max-w-md mx-auto p-6 border border-neon-cyan/30 bg-neon-cyan/5 rounded-2xl text-center space-y-4 mt-8"
                                        >
                                            <p className="text-neon-cyan text-xs font-bold tracking-widest uppercase">
                                                {isRedirecting ? t('fallbackAction') : t('aiOffline')}
                                            </p>
                                            <button
                                                onClick={handleFallbackRedirect}
                                                disabled={isRedirecting}
                                                className="w-full py-4 bg-neon-cyan text-black font-black text-xs tracking-[0.2em] rounded-xl border-2 border-neon-cyan hover:bg-transparent hover:text-neon-cyan transition-all duration-300 flex items-center justify-center gap-2 group"
                                            >
                                                {isRedirecting ? (
                                                    <Loader2 size={16} className="animate-spin" />
                                                ) : (
                                                    <>
                                                        {t('useClassicForm')}
                                                        <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" />
                                                    </>
                                                )}
                                            </button>
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
                                    placeholder={contactState === 'executing' ? "TRANSMITTING DATA..." : (isBooting ? t('initializing') : t('inputPlaceholder'))}
                                    disabled={isBooting || contactState === 'executing'}
                                    autoFocus
                                />
                                <button type="submit" disabled={isLoading || isBooting || !input.trim() || contactState === 'executing'} className="absolute right-2 p-1.5 text-neon-cyan hover:text-white disabled:opacity-30 transition-colors">
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
