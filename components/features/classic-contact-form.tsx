"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

import { Send, Loader2, AlertTriangle, User, Mail, Building, MessageSquare } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { sendContactEmail } from "@/app/actions";
import { CyberSelect } from "@/components/ui/cyber-select";
import { ContactSubmissionOverlay } from "@/components/features/contact-submission-overlay";
import { cn } from "@/lib/utils";


export function ClassicContactForm() {
    const t = useTranslations('contact');
    const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ name?: boolean; email?: boolean; message?: boolean }>({});
    const formRef = useRef<HTMLFormElement>(null);
    const [resetKey, setResetKey] = useState(0);

    async function handleSubmit(formData: FormData) {
        setState('sending');
        setErrorMessage(null);

        // Minimum animation duration of 3 seconds
        const minAnimationTime = new Promise(resolve => setTimeout(resolve, 3000));

        try {
            const [result] = await Promise.all([
                sendContactEmail(formData),
                minAnimationTime
            ]);

            if (result.success) {
                setState('success');
                formRef.current?.reset();
                setResetKey(prev => prev + 1);
            } else {
                setState('error');
                setErrorMessage(result.error || "System failure.");
            }
        } catch {
            setState('error');
            setErrorMessage("Connection lost.");
        }
    }

    // Auto-close success message after 6 seconds


    const inputClasses = "w-full bg-transparent border-none text-white placeholder:text-slate-500/50 focus:ring-0 focus:outline-none font-mono text-sm md:text-base h-full pl-14 pr-4 py-3 relative z-10 tracking-wide font-medium placeholder:uppercase placeholder:tracking-widest placeholder:text-xs";
    const labelClasses = "text-[10px] uppercase font-mono text-neon-cyan/60 tracking-[0.3em] mb-2 block pl-1";

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-5xl mx-auto"
        >
            <GlassPanel
                intensity="high"
                className="relative p-0 overflow-hidden border-neon-cyan/30 shadow-[0_0_50px_rgba(0,243,255,0.05)]"
            >
                {/* CYBER DECORATIONS */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent opacity-50" />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-pink/50 to-transparent opacity-50" />
                <div className="absolute top-2 right-2 p-2 opacity-20 pointer-events-none hidden xl:block">
                    <div className="font-mono text-[7px] text-neon-cyan text-right leading-tight">
                        SECURE_UPLINK_ESTABLISHED<br />
                        ENCRYPTION: QUANTUM-256<br />
                        LATENCY: 12ms
                    </div>
                </div>

                {/* SCANNING LINE */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-neon-cyan/30 shadow-[0_0_15px_rgba(0,243,255,0.5)] animate-[scan_8s_ease-in-out_infinite]" />
                </div>

                <form
                    ref={formRef}
                    noValidate
                    onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);

                        // Manual Validation
                        const errors: typeof fieldErrors = {};
                        if (!formData.get('name')) errors.name = true;
                        if (!formData.get('email')) errors.email = true;
                        if (!formData.get('message')) errors.message = true;

                        if (Object.keys(errors).length > 0) {
                            setFieldErrors(errors);
                            return;
                        }

                        setFieldErrors({});
                        handleSubmit(formData);
                    }}
                    className="relative z-10 p-4 md:p-8 space-y-6"
                >
                    {/* HEADER */}
                    <div className="flex items-end gap-3 mb-2 border-b border-white/5 pb-4">
                        <div className="w-12 h-12 bg-neon-cyan/10 rounded-lg border border-neon-cyan/30 flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-neon-cyan/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            <Send className="w-6 h-6 text-neon-cyan group-hover:scale-110 transition-transform duration-300 relative z-10" />
                        </div>
                        <div>
                            <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider italic">
                                Transmit <span className="text-neon-cyan">Signal</span>
                            </h3>
                            <p className="text-xs font-mono text-slate-400 tracking-widest mt-1">
                                DIRECT_NEURAL_INTERFACE_READY
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* NAME INPUT */}
                        <div className="space-y-2 group">
                            <div className="flex justify-between items-baseline">
                                <label className={labelClasses}>{"01 // IDENTITY"}</label>
                                {fieldErrors.name && <span className="text-red-500 text-[10px] font-mono tracking-widest animate-pulse">{"//! REQUIRED"}</span>}
                            </div>
                            <div className={cn(
                                "relative h-12 bg-black/40 border transition-all duration-300 rounded-lg overflow-hidden group-focus-within:shadow-[0_0_20px_rgba(0,243,255,0.2)]",
                                fieldErrors.name ? "border-red-500/50" : "border-white/10 group-focus-within:border-neon-cyan/50"
                            )}>
                                <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center border-r border-white/5 bg-white/5 group-focus-within:bg-neon-cyan/10 group-focus-within:border-neon-cyan/30 transition-colors">
                                    <User className={cn("w-5 h-5 transition-colors", fieldErrors.name ? "text-red-400" : "text-slate-500 group-focus-within:text-neon-cyan")} />
                                </div>
                                <input
                                    name="name"
                                    placeholder={t('form.namePlaceholder')}
                                    className={inputClasses}
                                    onChange={() => setFieldErrors(prev => ({ ...prev, name: false }))}
                                />
                                {/* Corner Accents */}
                                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 group-focus-within:border-neon-cyan transition-colors" />
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-focus-within:border-neon-cyan transition-colors" />
                            </div>
                        </div>

                        {/* EMAIL INPUT */}
                        <div className="space-y-2 group">
                            <div className="flex justify-between items-baseline">
                                <label className={labelClasses}>{"02 // FREQUENCY (EMAIL)"}</label>
                                {fieldErrors.email && <span className="text-red-500 text-[10px] font-mono tracking-widest animate-pulse">{"//! REQUIRED"}</span>}
                            </div>
                            <div className={cn(
                                "relative h-12 bg-black/40 border transition-all duration-300 rounded-lg overflow-hidden group-focus-within:shadow-[0_0_20px_rgba(0,243,255,0.2)]",
                                fieldErrors.email ? "border-red-500/50" : "border-white/10 group-focus-within:border-neon-cyan/50"
                            )}>
                                <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center border-r border-white/5 bg-white/5 group-focus-within:bg-neon-cyan/10 group-focus-within:border-neon-cyan/30 transition-colors">
                                    <Mail className={cn("w-5 h-5 transition-colors", fieldErrors.email ? "text-red-400" : "text-slate-500 group-focus-within:text-neon-cyan")} />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder={t('form.emailPlaceholder')}
                                    className={inputClasses}
                                    onChange={() => setFieldErrors(prev => ({ ...prev, email: false }))}
                                />
                                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 group-focus-within:border-neon-cyan transition-colors" />
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-focus-within:border-neon-cyan transition-colors" />
                            </div>
                        </div>
                    </div>

                    {/* COMPANY INPUT */}
                    <div className="space-y-2 group">
                        <label className={labelClasses}>{"03 // AFFILIATION (OPTIONAL)"}</label>
                        <div className="relative h-12 bg-black/40 border border-white/10 transition-all duration-300 rounded-lg overflow-hidden group-focus-within:border-neon-cyan/50 group-focus-within:shadow-[0_0_20px_rgba(0,243,255,0.2)]">
                            <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center border-r border-white/5 bg-white/5 group-focus-within:bg-neon-cyan/10 group-focus-within:border-neon-cyan/30 transition-colors">
                                <Building className="w-5 h-5 text-slate-500 group-focus-within:text-neon-cyan transition-colors" />
                            </div>
                            <input
                                name="company"
                                placeholder={t('form.companyPlaceholder')}
                                className={inputClasses}
                            />
                            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 group-focus-within:border-neon-cyan transition-colors" />
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-focus-within:border-neon-cyan transition-colors" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <CyberSelect
                            key={`project-${resetKey}`}
                            name="projectType"
                            label="04 // MISSION_TYPE"
                            placeholder={t('form.projectTypePlaceholder')}
                            options={[
                                { label: t('projectTypes.cloud'), value: 'cloud' },
                                { label: t('projectTypes.fullstack'), value: 'fullstack' },
                                { label: t('projectTypes.security'), value: 'security' },
                                { label: t('projectTypes.iot'), value: 'iot' },
                                { label: t('projectTypes.consulting'), value: 'consulting' },
                                { label: t('projectTypes.other'), value: 'other' }
                            ]}
                        />
                        <CyberSelect
                            key={`budget-${resetKey}`}
                            name="budget"
                            label="05 // RESOURCES"
                            placeholder={t('form.budgetPlaceholder')}
                            options={[
                                { label: t('budgets.small'), value: 'small' },
                                { label: t('budgets.medium'), value: 'medium' },
                                { label: t('budgets.large'), value: 'large' },
                                { label: t('budgets.xlarge'), value: 'xlarge' },
                                { label: t('budgets.enterprise'), value: 'enterprise' },
                                { label: t('budgets.discuss'), value: 'discuss' }
                            ]}
                        />
                        <CyberSelect
                            key={`timeline-${resetKey}`}
                            name="timeline"
                            label="06 // TIMELINE"
                            placeholder={t('form.timelinePlaceholder')}
                            options={[
                                { label: t('timelines.urgent'), value: 'urgent' },
                                { label: t('timelines.short'), value: 'short' },
                                { label: t('timelines.medium'), value: 'medium' },
                                { label: t('timelines.long'), value: 'long' },
                                { label: t('timelines.flexible'), value: 'flexible' }
                            ]}
                        />
                    </div>

                    {/* MESSAGE INPUT */}
                    <div className="space-y-2 group">
                        <div className="flex justify-between items-baseline">
                            <label className={labelClasses}>{"07 // PAYLOAD (MESSAGE)"}</label>
                            {fieldErrors.message && <span className="text-red-500 text-[10px] font-mono tracking-widest animate-pulse">{"//! REQUIRED"}</span>}
                        </div>
                        <div className={cn(
                            "relative bg-black/40 border transition-all duration-300 rounded-lg overflow-hidden group-focus-within:shadow-[0_0_20px_rgba(0,243,255,0.2)]",
                            fieldErrors.message ? "border-red-500/50" : "border-white/10 group-focus-within:border-neon-cyan/50"
                        )}>
                            <div className="absolute left-0 top-0 w-12 h-full flex pt-3 justify-center border-r border-white/5 bg-white/5 group-focus-within:bg-neon-cyan/10 group-focus-within:border-neon-cyan/30 transition-colors">
                                <MessageSquare className={cn("w-5 h-5 transition-colors", fieldErrors.message ? "text-red-400" : "text-slate-500 group-focus-within:text-neon-cyan")} />
                            </div>
                            <textarea
                                name="message"
                                rows={4}
                                placeholder={t('form.messagePlaceholder')}
                                className={cn(inputClasses, "resize-none")}
                                onChange={() => setFieldErrors(prev => ({ ...prev, message: false }))}
                            />
                            {/* Corner Accents */}
                            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 group-focus-within:border-neon-cyan transition-colors" />
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-focus-within:border-neon-cyan transition-colors" />
                            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 group-focus-within:border-neon-cyan transition-colors" />
                        </div>
                    </div>

                    <ContactSubmissionOverlay
                        status={state}
                        onClose={() => setState('idle')}
                    />

                    <AnimatePresence>
                        {state === 'error' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-center gap-3"
                            >
                                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                                <p className="text-red-500 text-xs font-mono uppercase tracking-wider">{errorMessage}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* SUBMIT BUTTON */}
                    <button
                        type="submit"
                        disabled={state === 'sending'}
                        className="w-full group relative py-4 overflow-hidden rounded-xl bg-transparent border border-neon-cyan/50 hover:bg-neon-cyan/5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="absolute inset-0 bg-neon-cyan/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />

                        {/* Button Scanline */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-30 pointer-events-none">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-neon-cyan shadow-[0_0_10px_#00f3ff] animate-[scan_2s_ease-in-out_infinite]" />
                        </div>

                        <div className="relative z-10 flex items-center justify-center gap-4">
                            {state === 'sending' ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin text-neon-cyan" />
                                    <span className="font-mono text-neon-cyan text-xs uppercase tracking-[0.3em] animate-pulse">Encoding...</span>
                                </>
                            ) : (
                                <>
                                    <span className="font-black italic text-white uppercase tracking-[0.4em] group-hover:tracking-[0.6em] transition-all duration-300 group-hover:text-neon-cyan">
                                        {t('form.submit')}
                                    </span>
                                    <Send className="w-5 h-5 text-neon-cyan group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform duration-300" />
                                </>
                            )}
                        </div>

                        {/* Button Corners */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-neon-cyan" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-neon-cyan" />
                    </button>
                </form>
            </GlassPanel>
        </motion.div>
    );
}
