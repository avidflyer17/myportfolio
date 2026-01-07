"use client";

import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { Github, Linkedin, Mail } from 'lucide-react';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { CTAButton } from "@/components/ui/cta-button";
import { smoothScrollTo } from "@/lib/smooth-scroll";

const VisitorMap = dynamic(() => import('@/components/ui/visitor-map').then(mod => mod.VisitorMap), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[400px] flex items-center justify-center bg-black/90 border border-neon-cyan/20 rounded-xl">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 rounded-full border-2 border-neon-cyan border-t-transparent animate-spin"></div>
                <span className="text-neon-cyan font-mono text-sm animate-pulse">ESTABLISHING UPLINK...</span>
            </div>
        </div>
    )
});

export function FooterSection() {
    const t = useTranslations('footer.globalPresence');

    return (
        <footer className="w-full py-10 bg-black/90 border-t border-neon-cyan/20 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 bg-[size:30px_30px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold font-mono text-white">
                            <span className="text-neon-pink">&lt;</span>
                            {t('title')}
                            <span className="text-neon-pink">/&gt;</span>
                        </h3>
                        <p className="text-gray-400 max-w-md">
                            {t('description')}
                        </p>

                        <div className="flex gap-4 text-sm font-mono text-neon-cyan opacity-80">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                {t('systemNormal')}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-neon-pink rounded-full animate-pulse"></span>
                                {t('encryptionActive')}
                            </div>
                        </div>

                        <div className="pt-4">
                            <CTAButton
                                variant="primary"
                                icon={Mail}
                                onClick={(e) => smoothScrollTo(e, 'contact')}
                            >
                                {t('cta.contact')}
                            </CTAButton>
                        </div>
                    </div>

                    <div className="w-full">
                        <VisitorMap />
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm font-mono">
                        © {new Date().getFullYear()} Damien Schonbakler. {t('copyright')}
                    </p>

                    {/* Language Switcher */}
                    <LanguageSwitcher />

                    <div className="flex gap-6 text-gray-500 text-sm">
                        <a href="https://github.com/avidflyer17" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-neon-cyan transition-colors group">
                            <Github className="w-4 h-4 group-hover:drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] transition-all" />
                            <span>GITHUB</span>
                        </a>
                        <a href="https://www.linkedin.com/in/damien-s-1995bb108/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-neon-cyan transition-colors group">
                            <Linkedin className="w-4 h-4 group-hover:drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] transition-all" />
                            <span>LINKEDIN</span>
                        </a>
                    </div>
                </div>

            </div>
        </footer>
    );
}
