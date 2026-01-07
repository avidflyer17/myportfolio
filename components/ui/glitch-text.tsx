"use client";



interface GlitchTextProps {
    text: string;
    className?: string; // Layout/Wrapper styles
    textClassName?: string; // Main Text styles (colors, gradients)
}

export function GlitchText({ text, className = "", textClassName = "" }: GlitchTextProps) {
    return (
        <div className={`relative inline-block group ${className}`}>
            <span className={`relative z-10 ${textClassName}`}>{text}</span>
            <span className="absolute top-0 left-0 -z-10 w-full h-full text-neon-cyan opacity-0 group-hover:opacity-70 group-hover:translate-x-[2px] transition-all duration-100 animate-pulse">
                {text}
            </span>
            <span className="absolute top-0 left-0 -z-10 w-full h-full text-neon-pink opacity-0 group-hover:opacity-70 group-hover:-translate-x-[2px] transition-all duration-100 animate-pulse delay-75">
                {text}
            </span>
        </div>
    );
}
