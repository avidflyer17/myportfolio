"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SelectOption {
    value: string;
    label: string;
}

interface CyberSelectProps {
    name: string;
    label: string;
    options: SelectOption[];
    placeholder?: string;
    required?: boolean;
    onChange?: (value: string) => void;
}

export function CyberSelect({
    name,
    label,
    options,
    placeholder = "Select...",
    required = false,
    onChange
}: CyberSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState("");

    const handleSelect = (value: string) => {
        setSelectedValue(value);
        setIsOpen(false);
        onChange?.(value);
    };

    const selectedLabel = options.find(opt => opt.value === selectedValue)?.label || placeholder;

    return (
        <div className="space-y-2 relative">
            <label htmlFor={name} className="text-xs font-mono text-neon-cyan/80 uppercase tracking-wider">
                {label}
                {required && <span className="text-neon-pink ml-1">*</span>}
            </label>

            <div className="relative">
                {/* Hidden select for form submission */}
                <select
                    id={name}
                    name={name}
                    value={selectedValue}
                    onChange={(e) => handleSelect(e.target.value)}
                    required={required}
                    className="sr-only"
                    tabIndex={-1}
                >
                    <option value="">{placeholder}</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                {/* Custom styled trigger */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`
                        w-full bg-black/40 border rounded p-4 text-left
                        flex items-center justify-between
                        font-mono transition-all
                        ${isOpen
                            ? 'border-neon-cyan/50 bg-neon-cyan/5'
                            : 'border-white/10 hover:border-white/20'
                        }
                        ${selectedValue ? 'text-white' : 'text-slate-600'}
                    `}
                >
                    <span>{selectedLabel}</span>
                    <ChevronDown
                        className={`w-4 h-4 text-neon-cyan transition-transform ${isOpen ? 'rotate-180' : ''
                            }`}
                    />
                </button>

                {/* Dropdown menu */}
                <AnimatePresence>
                    {isOpen && (
                        <>
                            {/* Backdrop */}
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setIsOpen(false)}
                            />

                            {/* Options */}
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.15 }}
                                className="absolute z-20 w-full mt-2 bg-black/95 backdrop-blur-xl border border-neon-cyan/30 rounded shadow-[0_0_30px_rgba(0,243,255,0.2)] overflow-hidden"
                            >
                                <div className="max-h-60 overflow-y-auto">
                                    {options.map((option, index) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => handleSelect(option.value)}
                                            className={`
                                                w-full px-4 py-3 text-left font-mono text-sm
                                                transition-all
                                                ${selectedValue === option.value
                                                    ? 'bg-neon-cyan/20 text-neon-cyan border-l-2 border-neon-cyan'
                                                    : 'text-slate-300 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                                                }
                                                ${index !== options.length - 1 ? 'border-b border-white/5' : ''}
                                            `}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
