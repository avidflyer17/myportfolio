"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

import { Send, Loader2, AlertTriangle } from "lucide-react";
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
        } catch (err) {
            setState('error');
            setErrorMessage("Connection lost.");
        }
    }

    // Auto-close success message after 6 seconds


    const inputClasses = "w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-neon-pink/50 focus:bg-neon-pink/[0.02] transition-all font-mono text-sm";
    const labelClasses = "text-[10px] uppercase font-mono text-neon-pink/60 tracking-[0.3em] ml-2 block mb-2";

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl mx-auto"
        >
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
                className="relative space-y-8 bg-black/40 backdrop-blur-xl p-6 md:p-10 rounded-[2.5rem] border border-white/5 overflow-hidden"
            >
                {/* TECHNICAL OVERLAYS */}
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <div className="font-mono text-[8px] text-neon-pink text-right">
                        UPLINK_STRENGTH: 98%<br />
                        ENCRYPTION: AES-256
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2 group/field">
                        <div className="flex justify-between items-baseline">
                            <label className={labelClasses}>01_Identification_Name</label>
                            {fieldErrors.name && <span className="text-red-500 text-[10px] font-mono tracking-widest animate-pulse">//! REQUIRED</span>}
                        </div>
                        <input
                            name="name"
                            placeholder={t('form.namePlaceholder')}
                            className={cn(inputClasses, fieldErrors.name && "border-red-500/50 focus:border-red-500/80 bg-red-500/[0.02]")}
                            onChange={() => setFieldErrors(prev => ({ ...prev, name: false }))}
                        />
                    </div>
                    <div className="space-y-2 group/field">
                        <div className="flex justify-between items-baseline">
                            <label className={labelClasses}>02_Signal_Origin</label>
                            {fieldErrors.email && <span className="text-red-500 text-[10px] font-mono tracking-widest animate-pulse">//! REQUIRED</span>}
                        </div>
                        <input
                            name="email"
                            type="email"
                            placeholder={t('form.emailPlaceholder')}
                            className={cn(inputClasses, fieldErrors.email && "border-red-500/50 focus:border-red-500/80 bg-red-500/[0.02]")}
                            onChange={() => setFieldErrors(prev => ({ ...prev, email: false }))}
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
                        key={`project-${resetKey}`}
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
                        key={`budget-${resetKey}`}
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
                        key={`timeline-${resetKey}`}
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
                    <div className="flex justify-between items-baseline">
                        <label className={labelClasses}>07_Transmission_Payload</label>
                        {fieldErrors.message && <span className="text-red-500 text-[10px] font-mono tracking-widest animate-pulse">//! REQUIRED</span>}
                    </div>
                    <textarea
                        name="message"
                        rows={4}
                        placeholder={t('form.messagePlaceholder')}
                        className={cn(inputClasses, "resize-none h-40", fieldErrors.message && "border-red-500/50 focus:border-red-500/80 bg-red-500/[0.02]")}
                        onChange={() => setFieldErrors(prev => ({ ...prev, message: false }))}
                    />
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
