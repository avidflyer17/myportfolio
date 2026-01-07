"use client";

import { ButtonHTMLAttributes } from "react";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface CTAButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary";
    icon?: LucideIcon;
    children: React.ReactNode;
    pulse?: boolean;
}

export function CTAButton({
    variant = "primary",
    icon: Icon,
    children,
    pulse = false,
    className = "",
    ...props
}: CTAButtonProps) {
    const baseStyles = "px-8 py-4 font-bold rounded-lg transition-all duration-300 relative overflow-hidden group";

    const variants = {
        primary: `
            bg-gradient-to-r from-neon-cyan to-neon-pink 
            text-black 
            hover:shadow-[0_0_30px_rgba(0,243,255,0.5)]
            hover:scale-105
            ${pulse ? 'animate-pulse-slow' : ''}
        `,
        secondary: `
            border-2 border-neon-cyan
            text-neon-cyan
            hover:bg-neon-cyan/10
            hover:shadow-[0_0_20px_rgba(0,243,255,0.3)]
        `
    };

    return (
        <motion.button
            whileHover={{ scale: variant === "primary" ? 1.05 : 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] -translate-x-full group-hover:animate-[shimmer_1s_infinite]" />

            {/* Content */}
            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
                {Icon && <Icon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </span>

            {/* Bottom highlight */}
            <div className={`absolute inset-x-0 bottom-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity ${variant === "primary" ? "bg-white" : "bg-neon-cyan"
                }`} />
        </motion.button>
    );
}
