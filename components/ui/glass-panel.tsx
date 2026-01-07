
"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlassPanelProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    intensity?: "low" | "medium" | "high";
}

export function GlassPanel({
    children,
    className,
    intensity = "medium",
    ...props
}: GlassPanelProps) {
    const intensityStyles = {
        low: "bg-black/20 backdrop-blur-sm border-white/5",
        medium: "bg-black/40 backdrop-blur-md border-white/10",
        high: "bg-black/60 backdrop-blur-lg border-white/20",
    };

    return (
        <motion.div
            className={cn(
                "rounded-xl border relative overflow-hidden",
                intensityStyles[intensity],
                className
            )}
            {...props}
        >
            {/* Glossy reflection effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </motion.div>
    );
}
