"use client";

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useState } from 'react';

export function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isHovered, setIsHovered] = useState(false);

    const switchLocale = (newLocale: 'fr' | 'en') => {
        if (newLocale === locale) return;
        // console.log(`Switching locale to: ${newLocale} for path: ${pathname}`);
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <motion.div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative inline-flex items-center gap-2 px-4 py-2 bg-black/50 border border-white/10 rounded-lg hover:border-neon-cyan/50 transition-all duration-300 backdrop-blur-md group"
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0,243,255,0.3)' }}
        >
            {/* Icon */}
            <Globe
                className={`w-4 h-4 transition-colors duration-300 ${isHovered ? 'text-neon-cyan' : 'text-white/70'
                    }`}
            />

            {/* Language Codes */}
            <div className="flex items-center gap-2 font-mono text-xs tracking-wider relative z-20">
                <button
                    onClick={() => switchLocale('fr')}
                    className={`transition-all duration-300 hover:text-white pulse-subtle ${locale === 'fr'
                        ? 'text-neon-cyan font-bold scale-110'
                        : 'text-white/50'
                        }`}
                >
                    FR
                </button>
                <span className="text-white/30">|</span>
                <button
                    onClick={() => switchLocale('en')}
                    className={`transition-all duration-300 hover:text-white pulse-subtle ${locale === 'en'
                        ? 'text-neon-cyan font-bold scale-110'
                        : 'text-white/50'
                        }`}
                >
                    EN
                </button>
            </div>

            {/* Glow Effect */}
            <motion.div
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-neon-cyan/20 to-neon-pink/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                animate={{
                    opacity: isHovered ? [0.3, 0.6, 0.3] : 0,
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-neon-cyan/0 group-hover:border-neon-cyan transition-colors" />
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-neon-cyan/0 group-hover:border-neon-cyan transition-colors" />
        </motion.div>
    );
}
