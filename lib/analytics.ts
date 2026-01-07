/**
 * Analytics utility for tracking page views and custom events
 * Uses Plausible Analytics (privacy-focused, GDPR compliant)
 */

type PlausibleEventData = Record<string, string | number | boolean>;

interface PlausibleOptions {
    callback?: () => void;
    props?: PlausibleEventData;
}

declare global {
    interface Window {
        plausible?: (eventName: string, options?: PlausibleOptions) => void;
    }
}

/**
 * Track a page view (automatically handled by Plausible script)
 * Only call manually for SPA route changes if needed
 */
export function trackPageView(url: string) {
    if (typeof window === 'undefined' || !window.plausible) return;

    window.plausible('pageview', { props: { url } });
}

/**
 * Track a custom event with optional properties
 * @example trackEvent('Contact Form Submit', { section: 'hero' })
 */
export function trackEvent(eventName: string, props?: PlausibleEventData) {
    if (typeof window === 'undefined' || !window.plausible) return;

    // Only track in production
    if (process.env.NODE_ENV !== 'production') {
        console.log('[Analytics Dev]', eventName, props);
        return;
    }

    window.plausible(eventName, { props });
}

/**
 * Predefined event trackers for common actions
 */
export const analytics = {
    // Navigation
    clickProject: (projectName: string) =>
        trackEvent('Click Project', { project: projectName }),

    clickExperience: (company: string) =>
        trackEvent('Click Experience', { company }),

    // Contact form
    submitContact: (success: boolean) =>
        trackEvent('Submit Contact Form', { success: success ? 'yes' : 'no' }),

    // Downloads
    downloadCV: () =>
        trackEvent('Download CV'),

    // Social links
    clickSocial: (platform: string) =>
        trackEvent('Click Social', { platform }),

    // 3D Interaction
    interact3D: (interaction: string) =>
        trackEvent('3D Interaction', { type: interaction }),

    // Blog (future)
    viewBlogPost: (slug: string) =>
        trackEvent('View Blog Post', { slug }),

    clickBlogTag: (tag: string) =>
        trackEvent('Click Blog Tag', { tag }),
};
