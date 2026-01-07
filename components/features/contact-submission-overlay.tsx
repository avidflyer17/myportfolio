"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { ShieldCheck, X } from "lucide-react";
import { Portal } from "@/components/ui/portal";
import { WarpSpeed } from "@/components/ui/warp-speed";

interface ContactSubmissionOverlayProps {
    status: 'idle' | 'sending' | 'success' | 'error';
    onClose: () => void;
}

export function ContactSubmissionOverlay({ status, onClose }: ContactSubmissionOverlayProps) {
    const t = useTranslations('contact');

    // Auto-close on success
    useEffect(() => {
        if (status === 'success') {
            const timer = setTimeout(onClose, 6000);
            return () => clearTimeout(timer);
        }
    }, [status, onClose]);



    return (
        <Portal>
            <AnimatePresence>
                {(status === 'sending' || status === 'success') && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm"
                    >

                        {/* Layer 1: Background */}
                        <div className="absolute inset-0 bg-black/90 z-0" />

                        {/* Layer 2: Continuous Warp Effect */}
                        <WarpSpeed active={true} className="absolute inset-0 z-[1]" />

                        {/* Layer 3: UI Content */}
                        <div className="relative z-[10] w-full flex items-center justify-center">



                            <AnimatePresence mode="wait">
                                {status === 'sending' && (
                                    <motion.div
                                        key="sending-state"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                                        transition={{ duration: 0.5 }}
                                        className="text-center"
                                    >
                                        <div className="text-neon-cyan font-mono text-2xl tracking-[0.5em] font-black animate-pulse">
                                            HYPERSPACE_TRANSMISSION
                                        </div>
                                        <div className="text-neon-pink font-mono text-xs tracking-[1em] mt-2 animate-pulse">
                                            ENCRYPTING_PAYLOAD...
                                        </div>
                                    </motion.div>
                                )}

                                {status === 'success' && (
                                    <motion.div
                                        key="success-state"
                                        initial={{ opacity: 0, scale: 0.5, y: 50 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                        className="w-full max-w-xl mx-auto p-12 rounded-3xl border border-neon-cyan/50 bg-black/40 backdrop-blur-xl text-center space-y-8 relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-b from-neon-cyan/10 to-transparent pointer-events-none" />

                                        {/* Close Button */}
                                        <button
                                            onClick={onClose}
                                            className="absolute top-4 right-4 z-50 p-2 text-slate-500 hover:text-white transition-colors"
                                        >
                                            <X size={20} />
                                        </button>

                                        <div className="w-24 h-24 bg-neon-cyan/10 rounded-full flex items-center justify-center mx-auto border border-neon-cyan shadow-[0_0_30px_rgba(0,243,255,0.2)] animate-pulse">
                                            <ShieldCheck className="w-12 h-12 text-neon-cyan" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-3xl font-black text-white tracking-widest uppercase italic">{t('success')}</h3>
                                            <p className="text-slate-400 font-mono text-xs uppercase tracking-[0.2em]">Transmission successful. Response pending.</p>
                                        </div>
                                        <button
                                            onClick={onClose}
                                            className="group flex items-center gap-3 mx-auto text-neon-cyan text-xs font-mono hover:text-white transition-colors uppercase tracking-[0.3em]"
                                        >
                                            <span className="opacity-50 group-hover:opacity-100 transition-opacity">{'>'}</span>
                                            Init_New_Uplink
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Portal>
    );
}
