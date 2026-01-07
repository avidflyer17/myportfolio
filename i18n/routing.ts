import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    // All supported locales
    locales: ['fr', 'en'],

    // Used when no locale matches
    defaultLocale: 'fr',

    // Locale detection strategy
    localePrefix: 'as-needed' // French will have no prefix, English will have /en
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
    createNavigation(routing);
