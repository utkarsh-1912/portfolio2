import * as Sentry from '@sentry/nextjs';

// Server-side error monitoring. Inactive until SENTRY_DSN is set.
export async function register() {
    const dsn = process.env.SENTRY_DSN;
    if (!dsn) return;
    Sentry.init({
        dsn,
        environment: process.env.NODE_ENV,
        // Errors only; raise to e.g. 0.1 to also sample performance traces
        tracesSampleRate: 0,
    });
}

// Reports errors thrown while rendering server components and route handlers
export const onRequestError = Sentry.captureRequestError;
