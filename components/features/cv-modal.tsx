"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Download, FileText, ShieldCheck, Printer } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { useEffect } from "react";
import { createPortal } from "react-dom";

interface CVModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CVModal({ isOpen, onClose }: CVModalProps) {
    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    // Use portal to render at root level to avoid z-index issues
    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-6xl h-[90vh] flex flex-col pointer-events-none" // pointer-events-none on wrapper, auto on content
                    >
                        <GlassPanel intensity="high" className="w-full h-full flex flex-col p-0 overflow-hidden border-neon-cyan/30 pointer-events-auto shadow-[0_0_50px_rgba(0,243,255,0.15)]">

                            <div className="flex flex-col h-full w-full">
                                {/* Header */}
                                <div className="flex-none flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 text-neon-cyan/80 font-mono text-sm tracking-wider">
                                            <ShieldCheck className="w-4 h-4" />
                                            <span>SECURE_VIEWER_V1.0</span>
                                        </div>
                                        <div className="h-4 w-px bg-white/20" />
                                        <div className="hidden sm:flex items-center gap-2 text-slate-400 font-mono text-xs">
                                            <FileText className="w-3 h-3" />
                                            <span>cv-schonbakler-damien.pdf</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <a
                                            href="/cv-schonbakler-damien.pdf"
                                            download="cv-schonbakler-damien.pdf"
                                            className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-neon-cyan transition-colors"
                                            title="Download PDF"
                                        >
                                            <Download className="w-5 h-5" />
                                        </a>
                                        <button
                                            onClick={onClose}
                                            className="p-2 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                                            title="Close Viewer"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Toolbar / Status Bar */}
                                <div className="flex-none bg-neon-cyan/5 border-b border-neon-cyan/10 px-6 py-1 flex justify-between items-center text-[10px] font-mono text-neon-cyan/60">
                                    <span>STATUS: DECRYPTED</span>
                                    <span className="animate-pulse">_READ_ONLY_MODE</span>
                                </div>

                                {/* Main Content (PDF) */}
                                <div className="flex-1 relative w-full overflow-hidden bg-white">
                                    {/* Custom Scroll Wrapper with forced cyberpunk attributes */}
                                    <div className="absolute inset-0 w-full h-full overflow-y-auto">

                                        {/* Container with A4 aspect ratio to match PDF size */}
                                        <div className="w-full aspect-[210/297] relative">
                                            {/* Masking the PDF Toolbar by shifting up and clipping */}
                                            <div className="absolute inset-0 overflow-hidden">
                                                <iframe
                                                    src="/cv-schonbakler-damien.pdf#toolbar=0&navpanes=0&view=FitH"
                                                    className="w-full h-[calc(100%+60px)] -mt-[50px] border-none block"
                                                    title="CV Preview"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Scanning Overlay Animation */}
                                    <motion.div
                                        initial={{ top: "0%", opacity: 1 }}
                                        animate={{ top: "100%", opacity: 0 }}
                                        transition={{ duration: 1.5, ease: "linear" }}
                                        className="absolute left-0 right-0 h-1 bg-neon-cyan shadow-[0_0_20px_#00f3ff] z-20 pointer-events-none"
                                    />
                                    <motion.div
                                        initial={{ opacity: 0.2 }}
                                        animate={{ opacity: 0 }}
                                        transition={{ duration: 0.5, delay: 1.5 }}
                                        className="absolute inset-0 bg-neon-cyan/10 pointer-events-none z-10"
                                    />
                                </div>
                            </div>

                        </GlassPanel>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    // Render to body if window exists
    if (typeof window === "undefined") return null;
    return createPortal(modalContent, document.body);
}
