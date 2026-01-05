"use client";


import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Send, Shield, Wifi, CheckCircle2 } from "lucide-react";
import { sendContactEmail } from "@/app/actions";


export function ContactSection() {
    const [formState, setFormState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
    const [byteCount, setByteCount] = useState(0);

    // Calculate simulated byte size of form data
    const handleInput = (e: React.ChangeEvent<HTMLFormElement>) => {
        const formData = new FormData(e.currentTarget);
        let size = 0;
        formData.forEach((value) => {
            size += value.toString().length;
        });
        setByteCount(size);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormState('sending');

        // Play Sound Effect (Simulated for this demo)
        // if (audioRef.current) audioRef.current.play();

        const formData = new FormData(e.currentTarget);
        const result = await sendContactEmail(formData);

        if (result.success) {
            setFormState('sent');
            setTimeout(() => setFormState('idle'), 5000);
        } else {
            setFormState('error');
            setTimeout(() => setFormState('idle'), 3000);
        }
    };

    return (
        <section id="contact" className="py-32 relative overflow-hidden container mx-auto px-4 w-full">
            {/* Background Grid Decoration */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto">
                {/* Section Header */}
                <div className="flex flex-col items-center mb-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 mb-4"
                    >
                        <Wifi className="w-4 h-4 text-neon-cyan animate-pulse" />
                        <span className="text-xs font-mono text-neon-cyan tracking-widest">SIGNAL_STRENGTH: 100%</span>
                    </motion.div>

                    <motion.h2
                        className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        INITIATE <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-purple-500">TRANSMISSION</span>
                    </motion.h2>
                    <p className="text-slate-400 max-w-md mx-auto">
                        Secure channel open. Send your project brief, inquiry, or encrypted payload directly to the core.
                    </p>
                </div>

                {/* Terminal Form Window */}
                <GlassPanel intensity="high" className="p-0 overflow-hidden border border-white/10 bg-black/60 backdrop-blur-xl">

                    {/* Terminal Header Bar */}
                    <div className="bg-white/5 border-b border-white/10 p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                            </div>
                            <div className="ml-4 flex items-center gap-2 text-xs font-mono text-slate-400">
                                <Shield className="w-3 h-3 text-green-400" />
                                <span>ENCRYPTED_CONNECTION</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-xs font-mono text-neon-pink animate-pulse">
                                BUFFER: {byteCount}B
                            </div>
                            <div className="text-xs font-mono text-slate-500">
                                SMTP_RELAY_V4
                            </div>
                        </div>
                    </div>

                    <div className="p-8 md:p-12 relative">
                        {/* Form Content */}
                        <AnimatePresence mode="wait">
                            {formState === 'sent' ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center py-12 text-center"
                                >
                                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/30">
                                        <CheckCircle2 className="w-10 h-10 text-green-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">TRANSMISSION COMPLETE</h3>
                                    <p className="text-slate-400">Your message has been successfully logged in the mainframe.</p>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="form"
                                    onSubmit={handleSubmit}
                                    onChange={handleInput}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label htmlFor="contact-name" className="text-xs font-mono text-neon-cyan/80 uppercase tracking-wider">Identity_String</label>
                                            <input
                                                id="contact-name"
                                                name="name"
                                                required
                                                type="text"
                                                placeholder="John Doe"
                                                className="w-full bg-black/40 border border-white/10 rounded p-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-neon-cyan/50 focus:bg-neon-cyan/5 transition-all font-mono"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="contact-email" className="text-xs font-mono text-neon-cyan/80 uppercase tracking-wider">Comm_Frequency</label>
                                            <input
                                                id="contact-email"
                                                name="email"
                                                required
                                                type="email"
                                                placeholder="name@corp.com"
                                                className="w-full bg-black/40 border border-white/10 rounded p-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-neon-cyan/50 focus:bg-neon-cyan/5 transition-all font-mono"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="contact-message" className="text-xs font-mono text-neon-cyan/80 uppercase tracking-wider">Payload_Data</label>
                                        <textarea
                                            id="contact-message"
                                            name="message"
                                            required
                                            rows={5}
                                            placeholder="> Initialize message sequence..."
                                            className="w-full bg-black/40 border border-white/10 rounded p-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-neon-cyan/50 focus:bg-neon-cyan/5 transition-all font-mono resize-none"
                                        />
                                    </div>

                                    <button
                                        disabled={formState === 'sending'}
                                        className="w-full group relative overflow-hidden bg-white text-black font-bold py-4 rounded hover:bg-neon-cyan transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <div className="flex items-center justify-center gap-2 relative z-10">
                                            {formState === 'sending' ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                                    UPLINKING...
                                                </>
                                            ) : (
                                                <>
                                                    <span>TRANSMIT_DATA</span>
                                                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </div>
                                        {/* Scanline Effect on Button */}
                                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] -translate-x-full group-hover:animate-[shimmer_1s_infinite]" />
                                        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer System Lines */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-neon-pink via-neon-cyan to-neon-pink opacity-20" />
                </GlassPanel>

                {/* Decorative floating code - Fixed Octal literals */}
                <div className="absolute -right-20 -bottom-20 -z-10 opacity-10 blur-sm select-none pointer-events-none hidden md:block">
                    <pre className="text-neon-cyan font-mono text-xs leading-4">
                        {`10101010 01010010 01000001
00101110 01010011 01001101
01001001 01010100 01010100
ESTABLISHED_CONNECTION: TRUE
PACKET_LOSS: 0.00%
LATENCY: 12ms`}
                    </pre>
                </div>

            </div>
        </section>
    );
}
