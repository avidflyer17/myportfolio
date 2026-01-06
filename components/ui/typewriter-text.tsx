"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface TypewriterTextProps {
    text: string;
    className?: string;
    delay?: number;
    speed?: number;
}

export function TypewriterText({ text, className = "", delay = 0, speed = 0.05 }: TypewriterTextProps) {
    const [displayedText, setDisplayedText] = useState("");
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;

        let currentIndex = 0;
        const startTimeout = setTimeout(() => {
            const interval = setInterval(() => {
                if (currentIndex <= text.length) {
                    setDisplayedText(text.slice(0, currentIndex));
                    currentIndex++;
                } else {
                    clearInterval(interval);
                }
            }, speed * 1000);

            return () => clearInterval(interval);
        }, delay * 1000);

        return () => clearTimeout(startTimeout);
    }, [isInView, text, delay, speed]);

    return (
        <span ref={ref} className={className}>
            {displayedText}
            <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-[2px] h-[1em] bg-neon-pink ml-1 align-middle"
            />
        </span>
    );
}
