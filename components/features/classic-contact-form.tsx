"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Send, CheckCircle2, Loader2, AlertTriangle, ShieldCheck } from "lucide-react";
import { sendContactEmail } from "@/app/actions";
import { CyberSelect } from "@/components/ui/cyber-select";
import { cn } from "@/lib/utils";

export function ClassicContactForm() {
    const t = useTranslations('contact');
    const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setState('sending');
        setErrorMessage(null);

        try {
            const result = await sendContactEmail(formData);
            if (result.success) {
                setState('success');
            } else {
                setState('error');
                setErrorMessage(result.error || "System failure.");
            }
        } catch (err) {
            setState('error');
            setErrorMessage("Connection lost.");
        }
    }

    if (state === 'success') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-xl mx-auto p-12 rounded-3xl border border-neon-cyan/50 bg-black/40 backdrop-blur-xl text-center space-y-8 relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-b from-neon-cyan/10 to-transparent pointer-events-none" />
                <div className="w-24 h-24 bg-neon-cyan/10 rounded-full flex items-center justify-center mx-auto border border-neon-cyan shadow-[0_0_30px_rgba(0,243,255,0.2)] animate-pulse">
                    <ShieldCheck className="w-12 h-12 text-neon-cyan" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-3xl font-black text-white tracking-widest uppercase italic">{t('success')}</h3>
                    <p className="text-slate-400 font-mono text-xs uppercase tracking-[0.2em]">Transmission successful. Response pending.</p>
                </div>
                <button
                    onClick={() => setState('idle')}
                    className="group flex items-center gap-3 mx-auto text-neon-cyan text-xs font-mono hover:text-white transition-colors uppercase tracking-[0.3em]"
                >
                    <span className="opacity-50 group-hover:opacity-100 transition-opacity">{'>'}</span>
                    Init_New_Uplink
                </button>
            </motion.div>
        );
    }

    const inputClasses = "w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-neon-pink/50 focus:bg-neon-pink/[0.02] transition-all font-mono text-sm";
    const labelClasses = "text-[10px] uppercase font-mono text-neon-pink/60 tracking-[0.3em] ml-2 block mb-2";

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl mx-auto"
        >
            <form action={handleSubmit} className="relative space-y-8 bg-black/40 backdrop-blur-xl p-6 md:p-10 rounded-[2.5rem] border border-white/5 overflow-hidden">
                {/* TECHNICAL OVERLAYS */}
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <div className="font-mono text-[8px] text-neon-pink text-right">
                        UPLINK_STRENGTH: 98%<br />
                        ENCRYPTION: AES-256
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2 group/field">
                        <label className={labelClasses}>01_Identification_Name</label>
                        <input
                            name="name"
                            required
                            placeholder={t('form.namePlaceholder')}
                            className={inputClasses}
                        />
                    </div>
                    <div className="space-y-2 group/field">
                        <label className={labelClasses}>02_Signal_Origin</label>
                        <input
                            name="email"
                            type="email"
                            required
                            placeholder={t('form.emailPlaceholder')}
                            className={inputClasses}
                        />
                    </div>
                </div>

                <div className="space-y-2 group/field">
                    <label className={labelClasses}>03_Corporation_Entity</label>
                    <input
                        name="company"
                        placeholder={t('form.companyPlaceholder')}
                        className={inputClasses}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <CyberSelect
                        name="projectType"
                        label="04_Strategic_Type"
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
                        name="budget"
                        label="05_Resource_Allocation"
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
                        name="timeline"
                        label="06_Temporal_Horizon"
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

                <div className="space-y-2 group/field">
                    <label className={labelClasses}>07_Transmission_Payload</label>
                    <textarea
                        name="message"
                        required
                        rows={4}
                        placeholder={t('form.messagePlaceholder')}
                        className={cn(inputClasses, "resize-none h-40")}
                    />
                </div>

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

                <button
                    type="submit"
                    disabled={state === 'sending'}
                    className={cn(
                        "w-full py-6 rounded-2xl font-black italic tracking-[0.4em] transition-all relative overflow-hidden group/btn flex items-center justify-center gap-4",
                        state === 'sending'
                            ? "bg-white/5 text-slate-500 cursor-not-allowed border border-white/10"
                            : "bg-neon-pink text-black hover:bg-white hover:shadow-[0_0_50px_rgba(255,0,255,0.4)]"
                    )}
                >
                    <div className="relative z-10 flex items-center justify-center gap-3">
                        {state === 'sending' ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span className="uppercase text-xs">Transmitting...</span>
                            </>
                        ) : (
                            <>
                                <span className="uppercase text-sm">{t('form.submit')}</span>
                                <Send className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                            </>
                        )}
                    </div>
                </button>
            </form>
        </motion.div>
    );
}
