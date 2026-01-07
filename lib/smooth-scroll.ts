import { triggerGlitchNavigation } from "@/components/ui/glitch-overlay";

// Custom Easing Function: easeInOutExpo
function easeInOutExpo(t: number): number {
    return t === 0 ? 0
        : t === 1 ? 1
            : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2
                : (2 - Math.pow(2, -20 * t + 10)) / 2;
}

export const smoothScrollTo = (e: React.MouseEvent<Element> | null, id: string) => {
    if (e) e.preventDefault();

    // Trigger Global Glitch Effect
    triggerGlitchNavigation();

    const element = document.getElementById(id);
    if (!element) return;

    const targetPosition = element.getBoundingClientRect().top + window.scrollY;
    const startPosition = window.scrollY;
    // Ensure we don't scroll past document height
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const finalTarget = Math.min(targetPosition, maxScroll);
    const distance = finalTarget - startPosition;

    // Duration based on distance - faster for short, slightly slower for long to feel "weighty"
    // Min 800ms, Max 1500ms
    const duration = Math.min(1500, Math.max(800, Math.abs(distance) * 0.5));
    let startTime: number | null = null;

    function animation(currentTime: number) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        const ease = easeInOutExpo(progress);

        window.scrollTo(0, startPosition + distance * ease);

        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
};
