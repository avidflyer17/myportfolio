"use client";

import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Lock, Server, Database, Cloud, Shield, Wifi } from "lucide-react";

const PROJECTS = [
    {
        id: 1,
        title: "K8s_ORCHESTRATOR",
        subtitle: "Infrastructure Scalable",
        description: "Déploiement d'un cluster Kubernetes haute disponibilité multi-région pour une charge critique. Automatisation GitOps complète.",
        tech: ["Kubernetes", "Terraform", "ArgoCD", "AWS"],
        status: "CLASSIFIED",
        icon: Cloud
    },
    {
        id: 2,
        title: "SECURE_GATEWAY_V2",
        subtitle: "Larme de Cybersécurité",
        description: "Passerelle API durcie avec authentification mutuelle (mTLS) et analyse de trafic en temps réel pour l'IoT industriel.",
        tech: ["Node.js", "Redis", "Vault", "WAF"],
        status: "RESTRICTED",
        icon: Shield
    },
    {
        id: 3,
        title: "DATA_LAKE_CORE",
        subtitle: "Big Data Processing",
        description: "Pipeline ETL temps réel traitant 5To+ de données télémétriques par jour. Architecture Event-Driven.",
        tech: ["Kafka", "Spark", "PostgreSQL", "Python"],
        status: "PRIVATE",
        icon: Database
    },
    {
        id: 4,
        title: "DOMOTIC_NEXUS",
        subtitle: "Smart Environment Orchestration",
        description: "Infrastructure domotique conteneurisée gérant 50+ IoTs (Zigbee/Thread). Monitoring énergétique (InfluxDB) et automations critiques via Node-RED.",
        tech: ["Home Assistant", "Docker", "Zigbee", "InfluxDB"],
        status: "R&D_LAB",
        icon: Wifi
    }
];

export function ProjectsSection() {
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
                    STRATEGIC<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-purple-500">INITIATIVES</span>
                </motion.h2>
                <div className="mt-2 text-sm font-mono text-neon-pink/60 flex items-center gap-2">
                    <Lock className="w-3 h-3" />
                    <span>ACCESS_LEVEL: TOP_SECRET // AUTHORIZED_PERSONNEL_ONLY</span>
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
                        <GlassPanel intensity="low" className="h-full p-8 flex flex-col group hover:bg-white/5 transition-colors duration-500 border border-white/10 hover:border-neon-cyan/50 relative overflow-hidden">

                            {/* Hover Reveal Effect */}
                            <div className="absolute inset-0 bg-gradient-to-b from-neon-cyan/10 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out" />

                            {/* Header */}
                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className="p-3 bg-white/5 rounded border border-white/10 group-hover:border-neon-cyan/50 transition-colors">
                                    <project.icon className="w-8 h-8 text-white group-hover:text-neon-cyan transition-colors" />
                                </div>
                                <div className="flex items-center gap-1 px-2 py-1 bg-black/50 border border-white/10 rounded text-[10px] font-mono text-slate-400">
                                    <Lock className="w-3 h-3" />
                                    {project.status}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 relative z-10">
                                <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-neon-cyan transition-colors font-mono tracking-tight">
                                    {project.title}
                                </h3>
                                <div className="text-xs text-neon-pink font-mono mb-4 uppercase tracking-widest">
                                    {project.subtitle}
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                    {project.description}
                                </p>
                            </div>

                            {/* Tech Stack Footer */}
                            <div className="relative z-10 pt-6 border-t border-white/5">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.tech.map(t => (
                                        <span key={t} className="px-2 py-1 bg-white/5 rounded text-xs font-mono text-slate-300 border border-transparent group-hover:border-neon-cyan/20 transition-all">
                                            {t}
                                        </span>
                                    ))}
                                </div>

                                <button
                                    aria-label={`Voir l'architecture du projet ${project.title}`}
                                    className="w-full py-2 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors border border-dashed border-white/10 group-hover:border-white/30 rounded"
                                >
                                    <Server className="w-3 h-3" />
                                    Architecture View
                                </button>
                            </div>

                        </GlassPanel>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
