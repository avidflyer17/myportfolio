"use client";

import { useTranslations } from 'next-intl';
import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Badge } from "@/components/ui/badge";
import { CTAButton } from "@/components/ui/cta-button";
import { smoothScrollTo } from "@/lib/smooth-scroll";
import { Lock, Server, Database, Cloud, Shield, Wifi, MessageSquare } from "lucide-react";

const PROJECTS = [
    {
        id: 1,
        titleKey: "items.k8s.title",
        subtitleKey: "items.k8s.subtitle",
        descriptionKey: "items.k8s.description",
        tech: ["Kubernetes", "Terraform", "ArgoCD", "AWS"],
        status: "CLASSIFIED",
        icon: Cloud
    },
    {
        id: 2,
        titleKey: "items.gateway.title",
        subtitleKey: "items.gateway.subtitle",
        descriptionKey: "items.gateway.description",
        tech: ["Node.js", "Redis", "Vault", "WAF"],
        status: "RESTRICTED",
        icon: Shield
    },
    {
        id: 3,
        titleKey: "items.dataLake.title",
        subtitleKey: "items.dataLake.subtitle",
        descriptionKey: "items.dataLake.description",
        tech: ["Kafka", "Spark", "PostgreSQL", "Python"],
        status: "PRIVATE",
        icon: Database
    },
    {
        id: 4,
        titleKey: "items.borsalino.title",
        subtitleKey: "items.borsalino.subtitle",
        descriptionKey: "items.borsalino.description",
        tech: ["Next.js", "PostgreSQL", "Prisma", "TypeScript"],
        status: "PRODUCTION",
        icon: Server
    },
    {
        id: 5,
        titleKey: "items.domotic.title",
        subtitleKey: "items.domotic.subtitle",
        descriptionKey: "items.domotic.description",
        tech: ["Home Assistant", "Docker", "Zigbee", "InfluxDB"],
        status: "R&D_LAB",
        icon: Wifi
    }
];

export function ProjectsSection() {
    const t = useTranslations('projects');

    return (
        <section id="projects" className="py-32 relative overflow-hidden container mx-auto px-4">

            {/* Background Decor */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full bg-neon-cyan/5 blur-3xl rounded-full pointer-events-none" />

            <div className="flex flex-col items-start mb-16 relative z-10 border-l-4 border-neon-pink pl-6">
                <motion.h2
                    className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    {t('strategic')}<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-purple-500">{t('initiatives')}</span>
                </motion.h2>
                <div className="mt-2 text-sm font-mono text-neon-pink/60 flex items-center gap-2">
                    <Lock className="w-3 h-3" />
                    <span>{t('accessLevel')}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                {PROJECTS.map((project, index) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 }}
                    >
                        <GlassPanel
                            intensity="low"
                            className="h-full flex flex-col group relative overflow-hidden border border-white/10 hover:border-neon-cyan/30 transition-all duration-700 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:-translate-y-1"
                        >

                            {/* Animated Glow Effect - Full Coverage */}
                            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/0 via-neon-cyan/0 to-purple-500/0 group-hover:from-neon-cyan/8 group-hover:via-purple-500/4 group-hover:to-neon-pink/8 transition-all duration-700 pointer-events-none" />

                            {/* Scan Line Effect - Full Coverage */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none">
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-cyan/20 to-transparent h-[2px] w-full animate-[scan_3s_ease-in-out_infinite]" />
                            </div>

                            {/* Content Wrapper with Padding */}
                            <div className="relative z-10 p-8 flex flex-col h-full">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-white/5 rounded border border-white/10 group-hover:border-neon-cyan/60 group-hover:bg-neon-cyan/10 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-500 group-hover:rotate-[5deg]">
                                        <project.icon className="w-8 h-8 text-white group-hover:text-neon-cyan transition-all duration-500 group-hover:scale-110" />
                                    </div>
                                    <div className="flex items-center gap-1 px-2 py-1 bg-black/50 border border-white/10 group-hover:border-neon-pink/50 group-hover:bg-neon-pink/10 rounded text-[10px] font-mono text-slate-400 group-hover:text-neon-pink transition-all duration-500">
                                        <Lock className="w-3 h-3 group-hover:animate-pulse" />
                                        {project.status}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-neon-cyan transition-all duration-500 font-mono tracking-tight group-hover:tracking-wide">
                                        {t(project.titleKey)}
                                    </h3>
                                    <div className="text-xs text-neon-pink font-mono mb-4 uppercase tracking-widest group-hover:tracking-[0.3em] transition-all duration-500">
                                        {t(project.subtitleKey)}
                                    </div>
                                    <p className="text-slate-400 group-hover:text-slate-300 text-sm leading-relaxed mb-6 transition-colors duration-500">
                                        {t(project.descriptionKey)}
                                    </p>
                                </div>

                                {/* Tech Stack Footer */}
                                <div className="pt-6 border-t border-white/5 group-hover:border-neon-cyan/20 transition-colors duration-500">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.tech.map((t, i) => (
                                            <span
                                                key={t}
                                                className="px-2 py-1 bg-white/5 rounded text-xs font-mono text-slate-300 border border-transparent group-hover:border-neon-cyan/40 group-hover:bg-neon-cyan/10 group-hover:text-white group-hover:shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all duration-500"
                                                style={{ transitionDelay: `${i * 50}ms` }}
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>

                                    <button
                                        aria-label={`Voir l'architecture du projet ${t(project.titleKey)}`}
                                        className="w-full py-2 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-white group-hover:bg-neon-cyan/10 transition-all duration-500 border border-dashed border-white/10 group-hover:border-neon-cyan/50 rounded group-hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                                    >
                                        <Server className="w-3 h-3 group-hover:animate-pulse" />
                                        {t('architectureView')}
                                    </button>
                                </div>
                            </div>

                        </GlassPanel>
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
                    icon={MessageSquare}
                    onClick={(e) => smoothScrollTo(e, 'contact')}
                >
                    {t('cta.discussProject')}
                </CTAButton>
            </motion.div>
        </section>
    );
}
