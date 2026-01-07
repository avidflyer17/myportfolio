
"use client";

import { useTranslations } from 'next-intl';
import { useEffect, useState } from "react";
import { extractDataFromPDF, ExtractedData } from "@/lib/data-extractor";
import { motion, useScroll, useTransform } from "framer-motion";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Activity, Briefcase, Calendar, Hash, Terminal } from "lucide-react";
import { CTAButton } from "@/components/ui/cta-button";
import { smoothScrollTo } from "@/lib/smooth-scroll";

export function ExperienceSection() {
    const t = useTranslations('experience');
    const [data, setData] = useState<ExtractedData | null>(null);
    const [loading, setLoading] = useState(true);
    const { scrollYProgress } = useScroll();

    // Parallax effect for the central line
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    useEffect(() => {
        async function loadData() {
            // Using real data extraction
            const mockBuffer = Buffer.from("mock");
            const result = await extractDataFromPDF(mockBuffer);
            setData(result);
            setLoading(false);
        }
        loadData();
    }, []);

    if (loading) {
        return (
            <section className="py-24 relative overflow-hidden flex items-center justify-center min-h-[50vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin" />
                    <div className="text-neon-cyan font-mono animate-pulse tracking-widest">
                        {t('decryptingData')}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="experience" className="py-32 relative overflow-hidden container mx-auto px-4 z-10 w-full md:max-w-none">
            {/* Background Stream Effect */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-pink/50 to-transparent opacity-30" />

            <div className="flex flex-col items-center mb-20 relative">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative z-10"
                >
                    <div className="absolute -inset-4 bg-neon-pink/20 blur-xl rounded-full" />
                    <Briefcase className="w-12 h-12 text-neon-pink relative z-10" />
                </motion.div>

                <motion.h2
                    className="text-4xl md:text-6xl font-bold text-center mt-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-neon-pink to-white tracking-[0.2em] uppercase"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    {t('careerLogs')}
                </motion.h2>
                <div className="font-mono text-neon-pink/60 mt-2 text-sm tracking-widest">
                    &gt; {t('executionHistory')}
                </div>
            </div>

            <div className="relative z-10 max-w-[1600px] mx-auto">
                {/* Central Timeline Beam */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-slate-800 -translate-x-1/2">
                    <motion.div
                        style={{ height: y }}
                        className="w-full bg-gradient-to-b from-neon-cyan via-white to-neon-pink shadow-[0_0_15px_#fff]"
                    />
                </div>

                <div className="space-y-24 relative">
                    {data?.experience.map((job, index) => (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
                            className={`flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} gap-8 md:gap-0 items-center relative pl-12 md:pl-0`}
                        >
                            {/* Empty space for alignment */}
                            <div className="flex-1 w-full" />

                            {/* Connection Node */}
                            <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-8 md:top-1/2 md:-translate-y-1/2 w-8 h-8 z-20 flex items-center justify-center">
                                <div className="absolute inset-0 bg-black rounded-full border-2 border-neon-cyan shadow-[0_0_15px_rgba(0,243,255,0.5)]" />
                                <div className="w-2 h-2 bg-white rounded-full animate-ping relative z-10" />
                            </div>

                            {/* Content Card */}
                            <div className="flex-1 w-full md:px-12 group">
                                <GlassPanel intensity="high" className="relative p-0 overflow-hidden border-l-4 border-l-neon-cyan hover:border-l-neon-pink transition-colors duration-500 rounded-none bg-black/40 backdrop-blur-md">

                                    {/* Scanning Line Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-1000 ease-in-out pointer-events-none z-10" />

                                    {/* Header */}
                                    <div className="bg-white/5 p-6 border-b border-white/5 flex flex-col md:flex-row justify-between gap-4 md:items-center relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-2 opacity-10">
                                            <Activity className="w-24 h-24" />
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 text-neon-cyan mb-1">
                                                <Terminal className="w-4 h-4" />
                                                <span className="font-mono text-xs">{t(job.companyKey).toUpperCase()}</span>
                                            </div>
                                            <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-neon-cyan transition-colors">
                                                {t(job.titleKey)}
                                            </h3>
                                        </div>

                                        <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded border border-white/10 font-mono text-xs text-neon-pink whitespace-nowrap">
                                            <Calendar className="w-3 h-3" />
                                            {t(job.periodKey)}
                                        </div>
                                    </div>

                                    {/* Body */}
                                    <div className="p-6 md:p-8">
                                        <p className="text-slate-300 leading-relaxed mb-8 font-light border-l-2 border-white/10 pl-4">
                                            {t(job.descriptionKey)}
                                        </p>

                                        <div className="flex flex-wrap gap-3">
                                            {job.tech.map((tech) => (
                                                <div key={tech} className="relative group/tech">
                                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan to-purple-600 rounded opacity-20 blur group-hover/tech:opacity-75 transition duration-200" />
                                                    <span className="relative flex items-center gap-1 px-3 py-1.5 bg-black rounded border border-white/10 text-xs font-mono text-slate-400 group-hover/tech:text-white transition-colors">
                                                        <Hash className="w-3 h-3 text-neon-cyan/50" />
                                                        {tech}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Footer Deco */}
                                    <div className="h-1 w-full bg-gradient-to-r from-neon-cyan/20 to-transparent" />
                                </GlassPanel>
                            </div>
                        </motion.div>
                    ))}

                </div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 flex justify-center"
                >
                    <CTAButton
                        variant="primary"
                        icon={Briefcase}
                        pulse={true}
                        onClick={(e) => smoothScrollTo(e, 'contact')}
                        trackingLabel="Collaborate"
                        trackingLocation="Experience"
                    >
                        {t('cta.collaborate')}
                    </CTAButton>
                </motion.div>
            </div>
        </section>
    );
}
